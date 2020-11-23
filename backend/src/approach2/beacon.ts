import {Router} from "express";
import jwt from 'jsonwebtoken';
import seedrandom from "seedrandom";
import {BEACON_KEYS_SIZE} from "./index";
import crypto from "crypto";

const router = Router();

router.get("/:beaconKey/:timestamp", async (req, res, ) => {
    const rand = seedrandom(req.params.beaconKey);
    const dbIndex : number = parseInt(req.params.timestamp, 10) % BEACON_KEYS_SIZE;
    for (let i = 0; i < dbIndex; i++) {
        rand.int32();
    }
    const beaconKey = rand.int32();
    const token = jwt.sign({"timestamp": parseInt(req.params.timestamp, 10), "beaconKey": beaconKey}, req.params.beaconKey);
    res.json({"token": token});
});

router.get("/generate", async (req, res) => {
    const key = crypto.randomBytes(48).toString('hex')
    res.json({"beacon_key": key});
})

export default router;