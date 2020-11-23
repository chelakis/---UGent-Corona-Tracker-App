"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const citizen_1 = require("../providers/citizen");
const express_1 = require("express");
const router = express_1.Router();
// Retrieve status from users
router.get("/users/status", (((req, res) => {
    citizen_1.getCitizenRisk(res.locals.jwt.uuid)
        .then(risk => res.send(risk))
        .catch(e => {
        console.log(e);
        res.sendStatus(500);
    });
})));
// For debugging
// Set status for user
router.put("/users/status", (((req, res) => {
    citizen_1.setCitizenRisk(res.locals.jwt.uuid, (!!req.body.positive || req.body.positive === "true") ? 1 : 0)
        .then(() => res.sendStatus(204))
        .catch(e => {
        console.log(e);
        res.sendStatus(500);
    });
})));
// For debugging
// Set status for user
router.delete("/users/status", (((req, res) => {
    citizen_1.resetCitizenRisk(res.locals.jwt.uuid)
        .then(() => res.sendStatus(204))
        .catch(e => {
        console.log(e);
        res.sendStatus(500);
    });
})));
exports.default = router;
//# sourceMappingURL=index.js.map