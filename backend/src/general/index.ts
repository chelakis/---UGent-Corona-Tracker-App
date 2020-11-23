import {registerExternal, registerInternal} from "../providers/citizen";
import {Router} from "express";

const router = Router();

router.post("/external/authorize", (((req, res) => {
    registerExternal()
        .then(data => res.send(data))
        .catch(e => {
            res.sendStatus(500);
        });
})));

router.post("/users/:uuid/register", (((req, res) => {
    registerInternal(req.params.uuid, req.body.token)
        .then(token => res.send({token}))
        .catch(e => {
            res.sendStatus(401);
        });
})));

export default router;