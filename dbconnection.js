const {Pool} = require('pg')
require("dotenv").config();

const db = new Pool({
    host: "aws-0-eu-central-1.pooler.supabase.com",
    user: "postgres.gkcathenefdtuudvdcco",
    port: 5432,
    password: process.env.DB_PASSWORD,
    database: "postgres"
})

module.exports = db;