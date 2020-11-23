"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const general_1 = __importDefault(require("./general"));
const auth_1 = __importDefault(require("./auth"));
const user_1 = __importDefault(require("./user"));
const approach1_1 = __importDefault(require("./approach1"));
const approach2_1 = __importDefault(require("./approach2"));
const body_parser_1 = __importDefault(require("body-parser"));
const postgres_1 = __importDefault(require("./providers/postgres"));
const beacon_1 = __importDefault(require("./approach2/beacon"));
// Load env variables from .env
dotenv_1.default.config();
const app = express_1.default();
const port = 8080;
/*app.use((req, res, next) => {
    res.set("Access-Control-Allow-Origin", "http://localhost:8081");
    res.set("Access-Control-Allow-Headers", ["Content-Type", "Authorization"]);
    res.set("Access-Control-Allow-Credentials", "true");
    res.set("Access-Control-Allow-Methods", ["GET", "PUT", "PATCH", "POST", "DELETE"]);
    next();
});*/
app.use(cors_1.default({
    allowedHeaders: ["Origin", "X-Requested-With", "Content-Type", "Accept", "X-Access-Token", "Authorization"],
    credentials: true,
    methods: "GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE",
    origin: "http://localhost:8081"
}));
app.use(body_parser_1.default.json());
app.use(general_1.default);
app.use("/beacon", beacon_1.default);
app.use(auth_1.default);
app.use(user_1.default);
app.use("/approach1", approach1_1.default);
app.use("/approach2", approach2_1.default);
postgres_1.default.connect()
    .then(() => {
    app.listen(port, () => {
        console.log(`server started at http://localhost:${port}`);
    });
})
    .catch(console.log);
//# sourceMappingURL=index.js.map