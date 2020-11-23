"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const citizen_1 = require("../providers/citizen");
const router = express_1.Router();
// Ask as challenge token for a token exchange
router.get("/users/challenge", ((req, res) => {
    citizen_1.generateChallengeToken(res.locals.jwt.uuid)
        .then(token => res.send({ token }))
        .catch(e => {
        console.log(e);
        res.sendStatus(403);
    });
}));
// Generates a token for a given user based on auth header
router.post("/users/challenge", ((req, res) => {
    citizen_1.generateOnlineToken(res.locals.jwt.uuid, req.body.challenge)
        .then(token => res.send({ token }))
        .catch(e => {
        console.log(e);
        res.sendStatus(403);
    });
}));
// Returns a token from an interaction between two devices
router.post("/users/response", ((req, res) => {
    citizen_1.acceptOnlineToken(res.locals.jwt.uuid, req.body.token)
        .then(() => res.sendStatus(204))
        .catch(e => {
        console.log(e);
        res.sendStatus(403);
    });
}));
exports.default = router;
//# sourceMappingURL=index.js.map