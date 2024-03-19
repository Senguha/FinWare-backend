const express = require('express')
const db = require('./dbconnection')
const cors = require("cors");
const corsOptions = {
    origin: "http://localhost:5173",
};
const app = express()
app.use(express.json())
app.use(cors(corsOptions));

app.get('/companies', async (req, res) => {
    try {
        const data = await db.query('SELECT * FROM companies')
        res.status(200).send(data.rows)
    } catch (err) {
        console.log(err)
        res.sendStatus(500)
    }
})

app.get('/parametres', async (req, res) => {
    try {
        const data = await db.query('SELECT * FROM parametres')
        res.status(200).send(data.rows)
    } catch (err) {
        console.log(err)
        res.sendStatus(500)
    }
})
app.get('/contactPersons', async (req, res) => {
    try {
        const data = await db.query('SELECT * FROM contact_persons')
        res.status(200).send(data.rows)
    } catch (err) {
        console.log(err)
        res.sendStatus(500)
    }
})


app.listen(5000, () => console.log(`Server has started on port: 5000`))