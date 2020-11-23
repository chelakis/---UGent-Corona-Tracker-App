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
const express_1 = require("express");
const postgres_1 = __importDefault(require("../providers/postgres"));
const citizen_1 = require("../providers/citizen");
const NotFoundError_1 = require("../errors/NotFoundError");
const OutdatedTokenError_1 = require("../errors/OutdatedTokenError");
const seedrandom_1 = __importDefault(require("seedrandom"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const router = express_1.Router();
exports.BEACON_KEYS_SIZE = 10;
const TOKEN_LIFETIME = 10;
// TODO: add doc
exports.logBeaconBasedInteraction = (sender, receiverBeacon, timestamp) => __awaiter(void 0, void 0, void 0, function* () {
    const receiver = yield beaconToUserId(sender, receiverBeacon, timestamp);
    yield citizen_1.logGenericInteraction(sender, `${receiver}`, timestamp);
});
/*
Retrieves the citizens ID form the database based of a beacon key
beaconKey: key from a beacon originating from a interaction POST
timestamp: timestamp of the interaction POST
 */
const beaconToUserId = (id, beaconKey, timestamp) => __awaiter(void 0, void 0, void 0, function* () {
    const timestampInt = parseInt(timestamp, 10);
    // TODO jwt key is not used?
    const payload = jsonwebtoken_1.default.decode(beaconKey);
    if (Math.abs(payload.timestamp - timestampInt) > TOKEN_LIFETIME)
        throw new OutdatedTokenError_1.OutdatedTokenError("Token timestamp is too old.");
    const tableID = payload.timestamp % exports.BEACON_KEYS_SIZE;
    const result = yield postgres_1.default.query({
        text: "SELECT * FROM public.beacon_keys_" + tableID + " WHERE beacon_key = $1",
        values: [payload.beaconKey]
    });
    if (result.rows.length !== 1)
        throw new NotFoundError_1.NotFoundError("Citizen does not exist.");
    const codeReply = yield postgres_1.default.query({
        text: "SELECT * FROM public.beacon_codes WHERE id = $1",
        values: [result.rows[0].id]
    });
    const verification = jsonwebtoken_1.default.verify(beaconKey, "" + codeReply.rows[0].beacon_code);
    if (verification != null)
        return result.rows[0].id;
    else
        console.log(verification);
    throw new NotFoundError_1.NotFoundError("The given token cannot be verified");
});
/*
id1: sender
id2: received key
adds a interaction entry to the database
 */
router.post("/interact/:beacon/:timestamp", (req, res) => {
    exports.logBeaconBasedInteraction(res.locals.jwt.uuid, req.params.beacon, req.params.timestamp)
        .then(() => res.sendStatus(200))
        .catch(err => {
        res.status(403).send(err);
        console.log(err);
    });
});
/*
Gives a internal citizen ID from a government ID
govid: government ID from something like Itsme
 */
router.post("/register/:beaconCode", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const rand = seedrandom_1.default(req.params.beaconCode);
    for (let i = 0; i < exports.BEACON_KEYS_SIZE; i++) {
        yield postgres_1.default.query({
            text: "INSERT INTO public.beacon_keys_" + i + " (beacon_key, id) VALUES ($1, $2)",
            values: [rand.int32(), res.locals.jwt.uuid]
        }).catch((e) => console.log(e));
    }
    yield postgres_1.default.query({
        text: "INSERT INTO public.beacon_codes (id, beacon_code) VALUES ($1, $2)",
        values: [res.locals.jwt.uuid, req.params.beaconCode]
    }).catch((e) => console.log(e));
    res.sendStatus(200);
}));
exports.default = router;
//# sourceMappingURL=index.js.map