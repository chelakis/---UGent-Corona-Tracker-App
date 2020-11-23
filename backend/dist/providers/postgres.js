"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pg_1 = require("pg");
// Setup postgres client credential with env variables or default to localhost
const postgres = new pg_1.Client({
    user: process.env.DB_USER || "postgres",
    password: process.env.DB_PASSWORD || "pg",
    port: parseInt(process.env.DB_PORT, 10) || 55432,
    database: process.env.DB_NAME || "postgres"
});
exports.default = postgres;
//# sourceMappingURL=postgres.js.map