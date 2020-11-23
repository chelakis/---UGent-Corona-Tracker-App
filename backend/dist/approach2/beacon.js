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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const seedrandom_1 = __importDefault(require("seedrandom"));
const index_1 = require("./index");
const crypto_1 = __importDefault(require("crypto"));
const router = express_1.Router();
router.get("/:beaconKey/:timestamp", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const rand = seedrandom_1.default(req.params.beaconKey);
    const dbIndex = parseInt(req.params.timestamp, 10) % index_1.BEACON_KEYS_SIZE;
    for (let i = 0; i < dbIndex; i++) {
        rand.int32();
    }
    const beaconKey = rand.int32();
    const token = jsonwebtoken_1.default.sign({ "timestamp": parseInt(req.params.timestamp, 10), "beaconKey": beaconKey }, req.params.beaconKey);
    res.json({ "token": token });
}));
router.get("/generate", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const key = crypto_1.default.randomBytes(48).toString('hex');
    res.json({ "beacon_key": key });
}));
exports.default = router;
//# sourceMappingURL=beacon.js.map