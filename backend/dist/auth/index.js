"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const tokens_1 = require("../crypto/tokens");
const router = express_1.Router();
router.use((req, res, next) => {
    // Check if auth header is set
    if (!req.headers.authorization) {
        res.status(401).send({ error: "Authorization header not set" });
        return;
    }
    const authParts = req.headers.authorization.split(" ");
    if (authParts.length !== 2) {
        res.status(401).send({ error: "Invalid authorization header" });
        return;
    }
    if (authParts[0].toLocaleLowerCase() !== "bearer") {
        res.status(401).send({ error: "Authorization must be bearer" });
        return;
    }
    const token = tokens_1.decrypt(authParts[1]);
    try {
        const payload = jsonwebtoken_1.default.verify(token, tokens_1.signingKey());
        if (typeof payload === "string") {
            res.status(401).send({ error: "Invalid authorization payload" });
            return;
        }
        res.locals.jwt = payload;
    }
    catch (e) {
        res.status(401).send({ error: "Invalid authorization token signature" });
        return;
    }
    next();
});
exports.default = router;
//# sourceMappingURL=index.js.map