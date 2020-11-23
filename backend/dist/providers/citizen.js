"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const postgres_1 = __importDefault(require("./postgres"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const tokens_1 = require("../crypto/tokens");
const NotFoundError_1 = require("../errors/NotFoundError");
const NotAuthorizedError_1 = require("../errors/NotAuthorizedError");
exports.TOKEN_TYPE_CHALLENGE = "CHALLENGE";
exports.TOKEN_TYPE_RESPONSE = "RESPONSE";
exports.TOKEN_EXPIRE_TIME = 15;
// Map simulating 3rd party auth service database
const authServiceTokens = {};
// Retrieve a citizen by UUID
exports.getCitizen = (uuid) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield postgres_1.default.query({
        text: "SELECT * FROM pg_citizen WHERE citizen_id=$1",
        values: [uuid]
    });
    if (result.rows.length === 0)
        throw new NotFoundError_1.NotFoundError("Citizen does not exist.");
    return result.rows[0];
});
// Retrieve calculated citizen risk
exports.getCitizenRisk = (uuid) => __awaiter(void 0, void 0, void 0, function* () {
    const row = yield exports.getCitizen(uuid);
    return exports.calculateRisk(row);
});
// Resets the user to a certain risk amount
exports.setCitizenRisk = (uuid, risk) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield exports.getCitizen(uuid);
    yield postgres_1.default.query({
        text: "UPDATE pg_citizen SET risk_sum=$1, interactions=$2 WHERE citizen_id=$3",
        values: [risk * 1000000, 1000000, user.citizen_id] // large number so it will not be affected by interactions
    }).catch((e) => {
        throw e;
    });
});
// Resets the user to risk 0
exports.resetCitizenRisk = (uuid) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield exports.getCitizen(uuid);
    yield postgres_1.default.query({
        text: "UPDATE pg_citizen SET risk_sum=$1, interactions=$2 WHERE citizen_id=$3",
        values: [0, 0, user.citizen_id]
    }).catch((e) => {
        throw e;
    });
});
// Registers a user in simulated 3rd party, then returns a token it can use to get jwt auth token
exports.registerExternal = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield postgres_1.default.query({
        text: "INSERT INTO pg_citizen DEFAULT VALUES RETURNING citizen_id;"
    });
    const uuid = result.rows[0].citizen_id;
    const token = tokens_1.randomSecureToken();
    authServiceTokens[uuid] = token;
    return {
        uuid,
        token
    };
});
// Gives a user an auth token it can use for future requests
exports.registerInternal = (uuid, token) => __awaiter(void 0, void 0, void 0, function* () {
    // Check if external service accepts this token for this uuid
    if (authServiceTokens[uuid] !== token)
        throw new NotAuthorizedError_1.NotAuthorized();
    delete authServiceTokens[uuid]; // token may not be reused
    // Generate jwt token for user
    return tokens_1.encrypt(jsonwebtoken_1.default.sign({ uuid, timestamp: (new Date()).getTime() }, tokens_1.signingKey()));
});
// Generate a challenge token that the requesting party can use to receive a response token
exports.generateChallengeToken = (uuid) => __awaiter(void 0, void 0, void 0, function* () {
    const payload = { sub: uuid, timestamp: `${(new Date()).getTime()}`, name: exports.TOKEN_TYPE_CHALLENGE };
    const token = jsonwebtoken_1.default.sign(payload, tokens_1.signingKey());
    return tokens_1.encrypt(token);
});
// Generate jwt token for user to exchange between devices
exports.generateOnlineToken = (uuid, challenge) => __awaiter(void 0, void 0, void 0, function* () {
    // Token is encrypted, decrypt it first
    challenge = tokens_1.decrypt(challenge);
    // Decode and verify jwt
    let json;
    try {
        json = jsonwebtoken_1.default.verify(challenge, tokens_1.signingKey());
    }
    catch (e) {
        throw Error("Invalid authorization payload");
    }
    if (typeof json === "string") {
        throw Error("Invalid authorization signature");
    }
    const { timestamp, sub, name } = json;
    if (name !== exports.TOKEN_TYPE_CHALLENGE) {
        throw Error("Invalid token type");
    }
    const payload = { sub: uuid, timestamp, origin: sub, name: exports.TOKEN_TYPE_RESPONSE };
    const token = jsonwebtoken_1.default.sign(payload, tokens_1.signingKey());
    return tokens_1.encrypt(token);
});
// Make sure token is not too old
const validTokenAge = (creation) => {
    const now = new Date();
    const elapsed = now.getTime() - creation;
    return (elapsed / 1000) < exports.TOKEN_EXPIRE_TIME;
};
// Validates a returned token and logs an interaction if the token is valid
exports.acceptOnlineToken = (uuid, token) => __awaiter(void 0, void 0, void 0, function* () {
    // Token is encrypted, decrypt it first
    token = tokens_1.decrypt(token);
    // Decode and verify jwt
    let payload;
    let json;
    try {
        payload = jsonwebtoken_1.default.verify(token, tokens_1.signingKey());
    }
    catch (e) {
        throw Error("Invalid authorization payload");
    }
    if (typeof payload === "string") {
        throw Error("Invalid authorization signature");
    }
    json = payload;
    if (!validTokenAge(parseInt(json.timestamp, 10))) {
        throw Error("Token has expired");
    }
    yield exports.logGenericInteraction(json.sub, json.origin, json.timestamp);
});
// Log an interaction between two users
exports.logGenericInteraction = (a, b, timestamp) => __awaiter(void 0, void 0, void 0, function* () {
    // Ignore self
    if (a === b)
        return;
    // Fetch users
    const user1 = yield exports.getCitizen(a);
    const user2 = yield exports.getCitizen(b);
    // Get risk
    const r1 = exports.calculateRisk(user1).risk;
    const r2 = exports.calculateRisk(user2).risk;
    // Calculate exchanged sickness
    const delta = r1 - r2;
    // Log interaction
    yield postgres_1.default.query({
        text: "INSERT INTO pg_interactions (citizen_a, citizen_b, datetime, risk_delta) VALUES ($1, $2, to_timestamp($3), $4)",
        values: [user1.citizen_id, user2.citizen_id, timestamp, delta]
    }).catch((e) => {
        throw e;
    });
    // Update citizen 1
    yield postgres_1.default.query({
        text: "UPDATE pg_citizen SET risk_sum=$1, interactions=$2 WHERE citizen_id=$3",
        values: [user1.risk_sum + r2, user1.interactions + 1, user1.citizen_id]
    }).catch((e) => {
        throw e;
    });
    // Update citizen 2
    yield postgres_1.default.query({
        text: "UPDATE pg_citizen SET risk_sum=$1, interactions=$2 WHERE citizen_id=$3",
        values: [user2.risk_sum + r1, user2.interactions + 1, user2.citizen_id]
    }).catch((e) => {
        throw e;
    });
});
// Returns risk as a text
exports.calculateRisk = (dbentry) => {
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
    return { risk, message };
};
//# sourceMappingURL=citizen.js.map