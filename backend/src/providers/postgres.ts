import {Client, QueryResultRow} from "pg";

// Setup postgres client credential with env variables or default to localhost
const postgres = new Client({
    user: process.env.DB_USER || "postgres",
    password: process.env.DB_PASSWORD || "pg",
    port: parseInt(process.env.DB_PORT, 10) || 55432,
    database: process.env.DB_NAME || "postgres"
})

export interface CitizenRow extends QueryResultRow {
    citizen_id: number
    risk_sum: number
    interactions: number
}

export interface DiagnosesRow extends QueryResultRow {
    citizen_id: number
    risk_sum: number
    interactions: number
}

export interface InteractionsRow extends QueryResultRow {
    citizen_a: number
    citizen_b: number
    risk_delta: number
    datetime: bigint
}

export interface BeaconKeys extends QueryResultRow {
    beacon_key: number
    id: number
}

export interface BeaconCode extends QueryResultRow {
    id: number
    beacon_code: number
}

export default postgres;