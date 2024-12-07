const express = require("express");
const router = express.Router();
const prisma = require("../prisma/prismaClient");


router.get("/", async (req, res) => {
    try {
      const data = await prisma.parametres.findMany();
      res.status(200).json(data);
    } catch (err) {
      console.log(err);
      res.sendStatus(500);
    }
  });
module.exports = router;
