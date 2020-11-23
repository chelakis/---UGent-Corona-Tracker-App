import {getCitizenRisk, resetCitizenRisk, setCitizenRisk} from "../providers/citizen";
import {Router} from "express";

const router = Router();

// Retrieve status from users
router.get("/users/status", (((req, res) => {
    getCitizenRisk(res.locals.jwt.uuid)
        .then(risk => res.send(risk))
        .catch(e => {
            console.log(e);
            res.sendStatus(500);
        });
})));


// For debugging
// Set status for user
router.put("/users/status", (((req, res) => {
    setCitizenRisk(res.locals.jwt.uuid, (!!req.body.positive || req.body.positive === "true") ? 1 : 0)
        .then(() => res.sendStatus(204))
        .catch(e => {
            console.log(e);
            res.sendStatus(500);
        });
})));

// For debugging
// Set status for user
router.delete("/users/status", (((req, res) => {
    resetCitizenRisk(res.locals.jwt.uuid)
        .then(() => res.sendStatus(204))
        .catch(e => {
            console.log(e);
            res.sendStatus(500);
        });
})));

export default router;