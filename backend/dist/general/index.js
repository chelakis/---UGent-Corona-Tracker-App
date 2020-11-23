"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const citizen_1 = require("../providers/citizen");
const express_1 = require("express");
const router = express_1.Router();
router.post("/external/authorize", (((req, res) => {
    citizen_1.registerExternal()
        .then(data => res.send(data))
        .catch(e => {
        res.sendStatus(500);
    });
})));
router.post("/users/:uuid/register", (((req, res) => {
    citizen_1.registerInternal(req.params.uuid, req.body.token)
        .then(token => res.send({ token }))
        .catch(e => {
        res.sendStatus(401);
    });
})));
exports.default = router;
//# sourceMappingURL=index.js.map