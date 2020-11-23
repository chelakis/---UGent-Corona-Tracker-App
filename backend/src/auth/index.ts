import {Router} from "express";
import jwt from 'jsonwebtoken';
import {decrypt, signingKey} from "../crypto/tokens";

const router = Router();

router.use((req, res, next) => {

    // Check if auth header is set
    if (!req.headers.authorization) {
        res.status(401).send({error: "Authorization header not set"});
        return;
    }

    const authParts = req.headers.authorization.split(" ");
    if (authParts.length !== 2) {
        res.status(401).send({error: "Invalid authorization header"});
        return;
    }

    if (authParts[0].toLocaleLowerCase() !== "bearer") {
        res.status(401).send({error: "Authorization must be bearer"});
        return;
    }

    const token = decrypt(authParts[1]);
    try {
        const payload = jwt.verify(token, signingKey());
        if (typeof payload === "string") {
            res.status(401).send({error: "Invalid authorization payload"});
            return;
        }
        res.locals.jwt = payload as { uuid: number, timestamp: number };
    } catch (e) {
        res.status(401).send({error: "Invalid authorization token signature"});
        return;
    }

    next();
});


export default router;