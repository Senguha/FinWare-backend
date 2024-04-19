const express = require("express");
const router = express.Router();
const prisma = require("../prisma/prismaClient");

router.put("/:id", async (req, res) => {
  try {
    const Data = req.body;
    const updateData = await prisma.contact_persons.update({
      where: { id: Number(req.params.id) },
      data: Data,
    });
    res.status(200).json(updateData);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});
router.delete("/:id", async (req, res) => {
  try {
    const Data = req.body;
    const deleteData = await prisma.contact_persons.delete({
      where: { id: Number(req.params.id) },
    });
    res.status(200).json(deleteData);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const data = await prisma.contact_persons.findUnique({
      where: { id: Number(req.params.id), },
    });
    res.status(200).json(data);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});


module.exports = router;
