const express = require("express");
const router = express.Router();
const prisma = require("../prisma/prismaClient");

router.get("/", async (req, res) => {
  try {
    const data = await prisma.companies.findMany({
      orderBy: {title:"asc"},
    });
    res.status(200).json(data);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

router.put("/:id", titleCheck, async (req, res) => {
  try {
    const Data = req.body;
    const updateData = await prisma.companies.update({
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
    const deleteData = await prisma.companies.delete({
      where: { id: Number(req.params.id) },
    });
    res.status(200).json(deleteData);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});
router.post("/",titleCheck, async (req, res) => {
  try {
    const Data = req.body;
    if (Data.personFirstName) {
      const createData = await prisma.companies.create({
        data: {
          title: Data.title,
          phone_number: Data.phone_number,
          countries: { connect: { id: Number(Data.country_id) } },
          city: Data.city,
          street: Data.street,
          building: Number(Data.building),
          contact_persons: {
            create: {
              first_name: Data.person_first_name,
              last_name: Data.person_last_name,
              middle_name: Data.person_middle_name,
              phone_number: Number(Data.person_number),
              position: Data.person_position,
            },
          },
          users: { connect: { id: Number(Data.owner_user_id) } },
        },
      });
      res.status(200).json(createData);
    } else {
      const createData = await prisma.companies.create({
        data: {
          title: Data.title,
          phone_number: Data.phoneNumber,
          countries: { connect: { id: Number(Data.countryId) } },
          city: Data.city,
          street: Data.street,
          building: Number(Data.building),
          users: { connect: { id: Number(Data.ownerUserId) } },
        },
      });
      res.status(200).json(createData);
    }
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const data = await prisma.companies.findUnique({
      where: { id: Number(req.params.id) },
    });
    res.status(200).json(data);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

async function titleCheck(req,res,next){
    if (req.body.title){
        const company = await prisma.companies.findFirst({
            where:{title: req.body.title},
        })
        if (company){
            res.status(400).send("Предприятие с таким именем уже существует!")
            return;
        }
    }
    next()
}

module.exports = router;
