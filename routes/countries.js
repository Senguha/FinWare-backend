const express = require("express");
const router = express.Router();
const prisma = require("../prisma/prismaClient");

router.get("/:id", async (req, res) => {
  try {
    const data = await prisma.countries.findUnique({
      where: { id: Number(req.params.id), },
    });
    res.status(200).json(data);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});
router.get("/", async (req, res) => {
    try {
      const data = await prisma.countries.findMany();
      res.status(200).json(data);
    } catch (err) {
      console.log(err);
      res.sendStatus(500);
    }
  });

module.exports = router;
