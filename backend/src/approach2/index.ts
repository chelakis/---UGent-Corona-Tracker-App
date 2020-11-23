import {Router} from "express";
import postgres, {BeaconKeys} from "../providers/postgres";
import {logGenericInteraction} from "../providers/citizen";
import {NotFoundError} from "../errors/NotFoundError";
import {OutdatedTokenError} from "../errors/OutdatedTokenError";
import seedrandom from "seedrandom";
import jwt from "jsonwebtoken";

const router = Router();

export const BEACON_KEYS_SIZE: number = 10;
const TOKEN_LIFETIME = 10;

// TODO: add doc
export const logBeaconBasedInteraction = async (sender: string, receiverBeacon: string, timestamp: string) => {
    const receiver = await beaconToUserId(sender, receiverBeacon, timestamp);
    await logGenericInteraction(sender, `${receiver}`, timestamp);
};

/*
Retrieves the citizens ID form the database based of a beacon key
beaconKey: key from a beacon originating from a interaction POST
timestamp: timestamp of the interaction POST
 */
const beaconToUserId = async (id: string, beaconKey: string, timestamp: string) => {
    const timestampInt: number = parseInt(timestamp, 10);
    // TODO jwt key is not used?
    const payload = jwt.decode(beaconKey) as { "timestamp": number, "beaconKey": number };
    if (Math.abs(payload.timestamp - timestampInt) > TOKEN_LIFETIME)
        throw new OutdatedTokenError("Token timestamp is too old.");
    const tableID: number = payload.timestamp % BEACON_KEYS_SIZE;
    const result = await postgres.query({
        text: "SELECT * FROM public.beacon_keys_" + tableID + " WHERE beacon_key = $1",
        values: [payload.beaconKey]
    });
    if (result.rows.length !== 1) throw new NotFoundError("Citizen does not exist.");
    const codeReply = await postgres.query({
        text: "SELECT * FROM public.beacon_codes WHERE id = $1",
        values: [result.rows[0].id]
    })
    const verification = jwt.verify(beaconKey, "" + codeReply.rows[0].beacon_code);
    if (verification != null)
        return result.rows[0].id;
    else
        console.log(verification)
    throw new NotFoundError("The given token cannot be verified")
};

/*
id1: sender
id2: received key
adds a interaction entry to the database
 */
router.post("/interact/:beacon/:timestamp", (req, res) => {
    logBeaconBasedInteraction(res.locals.jwt.uuid, req.params.beacon, req.params.timestamp)
        .then(() => res.sendStatus(200))
        .catch(err => {
            res.status(403).send(err);
            console.log(err)
        });
});

/*
Gives a internal citizen ID from a government ID
govid: government ID from something like Itsme
 */
router.post("/register/:beaconCode", async (req, res) => {
    const rand = seedrandom(req.params.beaconCode);
    for (let i = 0; i < BEACON_KEYS_SIZE; i++) {
        await postgres.query({
            text: "INSERT INTO public.beacon_keys_" + i + " (beacon_key, id) VALUES ($1, $2)",
            values: [rand.int32(), res.locals.jwt.uuid]
        }).catch((e) => console.log(e));
    }
    await postgres.query({
        text: "INSERT INTO public.beacon_codes (id, beacon_code) VALUES ($1, $2)",
        values: [res.locals.jwt.uuid, req.params.beaconCode]
    }).catch((e) => console.log(e));
    res.sendStatus(200);
});

export default router;