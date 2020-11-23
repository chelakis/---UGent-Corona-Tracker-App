import {Router} from "express";
import {acceptOnlineToken, generateChallengeToken, generateOnlineToken} from "../providers/citizen";

const router = Router();

// Ask as challenge token for a token exchange
router.get("/users/challenge", ((req, res) => {
    generateChallengeToken(res.locals.jwt.uuid)
        .then(token => res.send({token}))
        .catch(e => {
            console.log(e);
            res.sendStatus(403);
        });
}));

// Generates a token for a given user based on auth header
router.post("/users/challenge", ((req, res) => {
    generateOnlineToken(res.locals.jwt.uuid, req.body.challenge)
        .then(token => res.send({token}))
        .catch(e => {
            console.log(e);
            res.sendStatus(403);
        });
}));

// Returns a token from an interaction between two devices
router.post("/users/response", ((req, res) => {
    acceptOnlineToken(res.locals.jwt.uuid, req.body.token)
        .then(() => res.sendStatus(204))
        .catch(e => {
            console.log(e);
            res.sendStatus(403);
        });
}));

export default router;