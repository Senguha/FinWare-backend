const express = require("express");
const router = express.Router();
const prisma = require("../prisma/prismaClient");
const authCheck = require("../middleware/authCheck");

router.get("/", async (req, res) => {
  const brief = req.query.brief;
  let data;
  try {
    if (brief) {
      data = await prisma.companies.findMany({
        take: 5,
        select: {
          id: true,
          title: true,
          city: true,
          countries: {
            select: {
              title: true,
            },
          },
        },
      });
    } else {
      data = await prisma.companies.findMany({
        orderBy: { title: "asc" },
        select: {
          id: true,
          title: true,
          city: true,
          countries: {
            select: {
              title: true,
            },
          },
          report_lists: {
            orderBy: { created_at: "desc" },
            take: 1,
            include: {
              reports: {
                where: {
                  param_id: 203,
                },
                include: {
                  parametres: {
                    select: {
                      title: true,
                    },
                  },
                },
              },
            },
          },
        },
      });
    }
    res.status(200).json(data);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});
router.get("/user/:id", authCheck, async (req, res) => {
  try {
    const data = await prisma.companies.findMany({
      where: {
        owner_user_id: req.user.id,
      },
      orderBy: { title: "asc" },
      select: {
        id: true,
        title: true,
        city: true,
        countries: {
          select: {
            title: true,
          },
        },
        report_lists: {
          orderBy: { created_at: "desc" },
          take: 1,
          include: {
            reports: {
              where: {
                param_id: 203,
              },
              include: {
                parametres: {
                  select: {
                    title: true,
                  },
                },
              },
            },
          },
        },
      },
    });
    res.status(200).json(data);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});
router.get("/:id", async (req, res) => {
  try {
    const data = await prisma.companies.findUnique({
      where: { id: Number(req.params.id) },
      select: {
        id: true,
        title: true,
        phone_number: true,
        city: true,
        street: true,
        building: true,
        countries: {
          select: {
            title: true,
            id: true,
          },
        },
        contact_persons: {
          select: {
            first_name: true,
            last_name: true,
            middle_name: true,
            phone_number: true,
            position: true,
          },
        },
      },
    });
    res.status(200).json(data);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

router.put("/:id", authCheck, titleCheck, async (req, res) => {
  try {
    
    const Data = req.body;
    console.log(Data)
    let comp;
    let updateData, updateContact;
    if (!req.user.is_admin) {
      comp = await prisma.companies.findUnique({
        where: { id: Number(req.params.id) },
        select: {
          owner_user_id: true,
        },
      });
      if (comp.owner_user_id != req.user.id || !comp)
        return res.status(401).send("Access denied");
    }

    const contact = await prisma.contact_persons.findMany({
      where: { company_id: Number(req.params.id) },
    });
    console.log("contact", contact)

    if (Data.contact && contact.length != 0) {
      console.log("Есть контактные данные и запись в базе")
      updateData = await prisma.companies.update({
        where: { id: Number(req.params.id) },
        data: {
          title: Data.title,
          phone_number: Data.phoneNumber,
          countries: { connect: { id: Number(Data.country) } },
          city: Data.city,
          street: Data.street,
          building: Number(Data.building),
        },
      });
      updateContact = await prisma.contact_persons.updateMany({
        where: {
          company_id: Number(req.params.id),
        },
        data: {
          first_name: Data.personFirstName,
          last_name: Data.personLastName,
          middle_name: Data.personMiddleName,
          phone_number: Number(Data.personNumber),
          position: Data.personPosition,
        },
      });
    } else if (Data.contact && contact.length == 0) {
      console.log("Есть контактные данные и нет записи в базе")
      updateData = await prisma.companies.update({
        where: { id: Number(req.params.id) },
        data: {
          title: Data.title,
          phone_number: Data.phoneNumber,
          countries: { connect: { id: Number(Data.country) } },
          city: Data.city,
          street: Data.street,
          building: Number(Data.building),
          contact_persons: {
            create: {
              first_name: Data.personFirstName,
              last_name: Data.personLastName,
              middle_name: Data.personMiddleName,
              phone_number: Number(Data.personNumber),
              position: Data.personPosition,
            }
          },
        },
      });
    } else if (!Data.contact && contact.length == 0) {
      console.log("Нет контактных данных и нет записи в базе")
      updateData = await prisma.companies.update({
        where: { id: Number(req.params.id) },
        data: {
          title: Data.title,
          phone_number: Data.phoneNumber,
          countries: { connect: { id: Number(Data.country) } },
          city: Data.city,
          street: Data.street,
          building: Number(Data.building),
        },
      });
    } else if (!Data.contact && contact.length != 0) {
      console.log("Нет контактных данных и есть запись в базе")
      const delPerson = await prisma.contact_persons.deleteMany({
        where: {
          company_id: Number(req.params.id),
        },
      });
      updateData = await prisma.companies.update({
        where: { id: Number(req.params.id) },
        data: {
          title: Data.title,
          phone_number: Data.phoneNumber,
          countries: { connect: { id: Number(Data.country) } },
          city: Data.city,
          street: Data.street,
          building: Number(Data.building),
        },
      });
    }
    res.status(200).json(updateData);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});
router.delete("/:id", authCheck, async (req, res) => {
  try {
    if (!req.user.is_admin) {
      const comp = await prisma.companies.findUnique({
        where: { id: Number(req.params.id) },
        select: {
          owner_user_id: true,
        },
      });
      if (comp.owner_user_id != req.user.id || !comp)
        return res.status(401).send("Access denied");
    }

    const deleteData = await prisma.companies.delete({
      where: { id: Number(req.params.id) },
    });
    res.status(200).json(deleteData);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});
router.post("/", authCheck, titleCheck, async (req, res) => {
  try {
    const Data = req.body;
    if (Data.contact) {
      const createData = await prisma.companies.create({
        data: {
          title: Data.title,
          phone_number: Data.phoneNumber,
          countries: { connect: { id: Number(Data.country) } },
          city: Data.city,
          street: Data.street,
          building: Number(Data.building),
          contact_persons: {
            create: {
              first_name: Data.personFirstName,
              last_name: Data.personLastName,
              middle_name: Data.personMiddleName,
              phone_number: Number(Data.personNumber),
              position: Data.personPosition,
            },
          },
          users: { connect: { id: Number(req.user.id) } },
        },
      });
      res.status(200).json(createData);
    } else {
      const createData = await prisma.companies.create({
        data: {
          title: Data.title,
          phone_number: Data.phoneNumber.toString(),
          countries: { connect: { id: Number(Data.country) } },
          city: Data.city,
          street: Data.street,
          building: Number(Data.building),
          users: { connect: { id: Number(req.user.id) } },
        },
      });
      res.status(200).json(createData);
    }
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

async function titleCheck(req, res, next) {
  if (req.body.title) {
    const company = await prisma.companies.findFirst({
      where: { title: req.body.title },
    });
    if (company && company.id != req.params.id) {
      res.status(400).send("Предприятие с таким именем уже существует!");
      return;
    }
  }
  next();
}

module.exports = router;
