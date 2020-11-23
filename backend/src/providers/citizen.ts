import postgres, {CitizenRow} from "./postgres";
import {QueryResult} from "pg";
import jwt from 'jsonwebtoken';
import {decrypt, encrypt, randomSecureToken, signingKey} from "../crypto/tokens";
import {NotFoundError} from "../errors/NotFoundError";
import {NotAuthorized} from "../errors/NotAuthorizedError";

export const TOKEN_TYPE_CHALLENGE = "CHALLENGE";
export const TOKEN_TYPE_RESPONSE = "RESPONSE";
export const TOKEN_EXPIRE_TIME = 15;

// Map simulating 3rd party auth service database
const authServiceTokens: { [key: string]: string } = {};

// Retrieve a citizen by UUID
export const getCitizen = async (uuid: string) => {
    const result: QueryResult<CitizenRow> = await postgres.query({
        text: "SELECT * FROM pg_citizen WHERE citizen_id=$1",
        values: [uuid]
    });
    if (result.rows.length === 0)
        throw new NotFoundError("Citizen does not exist.");
    return result.rows[0];
};

// Retrieve calculated citizen risk
export const getCitizenRisk = async (uuid: string) => {
    const row = await getCitizen(uuid);
    return calculateRisk(row);
};

// Resets the user to a certain risk amount
export const setCitizenRisk = async (uuid: string, risk: number) => {
    const user = await getCitizen(uuid);
    await postgres.query({
        text: "UPDATE pg_citizen SET risk_sum=$1, interactions=$2 WHERE citizen_id=$3",
        values: [risk * 1000000, 1000000, user.citizen_id] // large number so it will not be affected by interactions
    }).catch((e) => {
        throw e;
    });
};

// Resets the user to risk 0
export const resetCitizenRisk = async (uuid: string) => {
    const user = await getCitizen(uuid);
    await postgres.query({
        text: "UPDATE pg_citizen SET risk_sum=$1, interactions=$2 WHERE citizen_id=$3",
        values: [0, 0, user.citizen_id]
    }).catch((e) => {
        throw e;
    });
};

// Registers a user in simulated 3rd party, then returns a token it can use to get jwt auth token
export const registerExternal = async () => {
    const result: QueryResult<CitizenRow> = await postgres.query({
        text: "INSERT INTO pg_citizen DEFAULT VALUES RETURNING citizen_id;"
    });
    const uuid = result.rows[0].citizen_id;
    const token = randomSecureToken();
    authServiceTokens[uuid] = token;
    return {
        uuid,
        token
    }
};

// Gives a user an auth token it can use for future requests
export const registerInternal = async (uuid: string, token: string) => {

    // Check if external service accepts this token for this uuid
    if (authServiceTokens[uuid] !== token)
        throw new NotAuthorized();
    delete authServiceTokens[uuid]; // token may not be reused

    // Generate jwt token for user
    return encrypt(jwt.sign({uuid, timestamp: (new Date()).getTime()}, signingKey()));
};

interface ChallengeType {
    sub: string
    timestamp: string
    name: string
}

// Generate a challenge token that the requesting party can use to receive a response token
export const generateChallengeToken = async (uuid: string) => {
    const payload: ChallengeType = {sub: uuid, timestamp: `${(new Date()).getTime()}`, name: TOKEN_TYPE_CHALLENGE};
    const token = jwt.sign(payload, signingKey());
    return encrypt(token);
}

interface ChallengeResponseType {
    sub: string
    timestamp: string
    name: string
    origin: string
}

// Generate jwt token for user to exchange between devices
export const generateOnlineToken = async (uuid: string, challenge: string) => {

    // Token is encrypted, decrypt it first
    challenge = decrypt(challenge);

    // Decode and verify jwt
    let json: object | string;
    try {
        json = jwt.verify(challenge, signingKey());
    } catch (e) {
        throw Error("Invalid authorization payload");
    }
    if (typeof json === "string") {
        throw Error("Invalid authorization signature");
    }
    const {timestamp, sub, name} = json as ChallengeType;
    if (name !== TOKEN_TYPE_CHALLENGE) {
        throw Error("Invalid token type");
    }

    const payload: ChallengeResponseType = {sub: uuid, timestamp, origin: sub, name: TOKEN_TYPE_RESPONSE};
    const token = jwt.sign(payload, signingKey());
    return encrypt(token);
};

// Make sure token is not too old
const validTokenAge = (creation: number): boolean => {
    const now = new Date();
    const elapsed = now.getTime() - creation;
    return (elapsed / 1000) < TOKEN_EXPIRE_TIME;
}

// Validates a returned token and logs an interaction if the token is valid
export const acceptOnlineToken = async (uuid: string, token: string) => {

    // Token is encrypted, decrypt it first
    token = decrypt(token);

    // Decode and verify jwt
    let payload: object | string;
    let json: ChallengeResponseType;
    try {
        payload = jwt.verify(token, signingKey());
    } catch (e) {
        throw Error("Invalid authorization payload");
    }
    if (typeof payload === "string") {
        throw Error("Invalid authorization signature");
    }
    json = payload as ChallengeResponseType;

    if (!validTokenAge(parseInt(json.timestamp, 10))) {
        throw Error("Token has expired");
    }

    await logGenericInteraction(json.sub, json.origin, json.timestamp);
}

// Log an interaction between two users
export const logGenericInteraction = async (a: string, b: string, timestamp: string) => {

    // Ignore self
    if (a === b) return;

    // Fetch users
    const user1 = await getCitizen(a);
    const user2 = await getCitizen(b);

    // Get risk
    const r1 = calculateRisk(user1).risk;
    const r2 = calculateRisk(user2).risk;

    // Calculate exchanged sickness
    const delta = r1 - r2;

    // Log interaction
    await postgres.query({
        text: "INSERT INTO pg_interactions (citizen_a, citizen_b, datetime, risk_delta) VALUES ($1, $2, to_timestamp($3), $4)",
        values: [user1.citizen_id, user2.citizen_id, timestamp, delta]
    }).catch((e) => {
        throw e;
    });

    // Update citizen 1
    await postgres.query({
        text: "UPDATE pg_citizen SET risk_sum=$1, interactions=$2 WHERE citizen_id=$3",
        values: [user1.risk_sum + r2, user1.interactions + 1, user1.citizen_id]
    }).catch((e) => {
        throw e;
    });

    // Update citizen 2
    await postgres.query({
        text: "UPDATE pg_citizen SET risk_sum=$1, interactions=$2 WHERE citizen_id=$3",
        values: [user2.risk_sum + r1, user2.interactions + 1, user2.citizen_id]
    }).catch((e) => {
        throw e;
    });
};

// Returns risk as a text
export const calculateRisk = (dbentry: CitizenRow) => {
    const risk = (dbentry.interactions !== 0) ? (dbentry.risk_sum / dbentry.interactions) : 0;

    let message = "safe";
    if (risk > 0.99)
        message = "carrier";
    else if (risk > 0.75)
        message = "high risk";
    else if (risk > 0.49)
        message = "medium risk";
    else if (risk > 0.25)
        message = "low risk";

    return {risk, message} as RiskFactor;
};

export interface RiskFactor {
    risk: number;
    message: string;
}

