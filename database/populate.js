const fs = require('fs');
const {Client} = require('pg');
const ap2Index = require("../backend/dist/approach2/index");

const client = new Client({
    user: "postgres",
    password: "pg",
    port: 55432,
    database: "postgres"
});

async function populate() {
    const ap1 = fs.readFileSync("./scripts/approach1.sql").toString();
    const ap2 = fs.readFileSync("./scripts/approach2.sql").toString();
    await client.query("DROP SCHEMA public CASCADE; CREATE SCHEMA public;");
    await client.query(ap1).catch((e) => {console.log(e)});
    await client.query(ap2).catch((e) => {console.log(e)});
    await generateBeaconTables();
}

function main() {
    client.connect()
        .then(() => populate()
            .finally(() => client.end()));
}

const generateBeaconTables = async () => {
    for (let i = 0; i < ap2Index.BEACON_KEYS_SIZE; i++){
        await client.query("create table beacon_keys_" + i + "(beacon_key serial not null constraint beacon_keys_" + i + "_pk primary key," +
            "id serial not null constraint beacon_keys_" + i + "_citizen_id_fk references pg_citizen)").catch((e) => {console.log(e)});
        await client.query("create unique index beacon_keys_" + i + "_beacon_key_uindex on beacon_keys_" + i + " (beacon_key)");
        await client.query("create unique index beacon_keys_" + i + "_id_uindex on beacon_keys_"+ i +" (id)");
    }
};

main();