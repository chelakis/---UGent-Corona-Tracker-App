import env from "dotenv";
import express from "express";
import cors from "cors";
import general from "./general";
import auth from "./auth";
import user from "./user";
import approach1 from "./approach1";
import approach2 from "./approach2";
import bodyParser from "body-parser";
import postgres from "./providers/postgres";
import beacon from "./approach2/beacon";
import router from "./approach2";

// Load env variables from .env
env.config();

const app = express();
const port = 8080;


/*app.use((req, res, next) => {
    res.set("Access-Control-Allow-Origin", "http://localhost:8081");
    res.set("Access-Control-Allow-Headers", ["Content-Type", "Authorization"]);
    res.set("Access-Control-Allow-Credentials", "true");
    res.set("Access-Control-Allow-Methods", ["GET", "PUT", "PATCH", "POST", "DELETE"]);
    next();
});*/
app.use(cors({
  allowedHeaders: ["Origin", "X-Requested-With", "Content-Type", "Accept", "X-Access-Token", "Authorization"],
  credentials: true,
  methods: "GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE",
  origin: "http://localhost:8081"
}));

app.use(bodyParser.json());

app.use(general);
app.use("/beacon", beacon);
app.use(auth);
app.use(user);
app.use("/approach1", approach1);
app.use("/approach2", approach2);

postgres.connect()
    .then(() => {
        app.listen(port, () => {
            console.log(`server started at http://localhost:${port}`);
        });
    })
    .catch(console.log);
