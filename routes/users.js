const express = require("express");
const router = express.Router();
const prisma = require("../prisma/prismaClient");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const authCheck = require("../middleware/authCheck");

router.put("/:id", authCheck, loginCheck, async (req, res) => {
  try {
    if (!req.user.is_admin) {
      const user = await prisma.users.findUnique({
        where: { id: Number(req.params.id) },
        select: {
          id: true,
        },
      });
      if (user.id != req.user.id || !user || req.body.is_admin)
        return res.status(401).send("Access denied");
    }

    let Data = req.body;
    Data.is_admin.length !== 0 && (Data.is_admin = Data.is_admin === "true");
    console.log(Data);

    if (req.body.password?.length === 0 || !req.body.password) {
      const updateData = await prisma.users.update({
        where: { id: req.params.id },
        data: Data,
      });
      res.status(200).json({
        login: updateData.login,
        id: updateData.id,
        created_at: updateData.created_at,
        is_admin: updateData.is_admin,
      });
      return;
    }

    Data.password = await bcrypt.hash(req.body.password, 10);

    const updateData = await prisma.users.update({
      where: { id: Number(req.params.id) },
      data: Data,
    });
    res.status(200).json({
      login: updateData.login,
      id: updateData.id,
      created_at: updateData.created_at,
      is_admin: updateData.is_admin,
    });
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});
router.post("/register", loginCheck, async (req, res) => {
  try {
    const Data = req.body;

    const hashPass = await bcrypt.hash(Data.password, 10);
    const newUser = await prisma.users.create({
      data: {
        login: Data.login,
        password: hashPass,
      },
    });
    const userId = newUser.id;
    const token = jwt.sign({ userId }, process.env.JWT_SECRET);
    res.cookie("jwt", token);
    res.status(200).json({
      login: newUser.login,
      id: newUser.id,
      created_at: newUser.created_at,
      is_admin: newUser.is_admin,
    });
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

router.post("/login", async (req, res) => {
  try {
    const Data = req.body;
    const user = await prisma.users.findUnique({
      where: {
        login: Data.login,
      },
    });
    if (!user) {
      res.status(401).send("Ваш логин и/или пароль введены неверно");
      return;
    }
    const auth = await bcrypt.compare(Data.password, user.password);

    if (!auth) {
      res.status(401).send("Ваш логин и/или пароль введены неверно");
      return;
    }
    const userId = user.id;
    const token = jwt.sign({ userId }, process.env.JWT_SECRET);

    console.log(token);
    res.cookie("jwt", token);
    res.status(200).json({
      login: user.login,
      created_at: user.created_at,
      is_admin: user.is_admin,
      id: user.id,
    });
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

router.get("/logout", async (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "Выход из системы выполнен успешно" });
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

router.get("/", authCheck, async (req, res) => {
  try {
    if (!req.user.is_admin) {
      return res.status(401).send("Access denied");
    }
    let data;

    data = await prisma.users.findMany({
      select: {
        id: true,
        login: true,
        created_at: true,
        _count: {
          select: {
            companies: true,
          },
        },
      },
    });
    res.status(200).json(data);
    return;
    res.status(200).json(data);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});
router.get("/:id", authCheck, async (req, res) => {
  try {
    if (!req.user.is_admin) {
      return res.status(401).send("Access denied");
    }
    let data;

    data = await prisma.users.findUnique({
      where: { id: Number(req.params.id) },
    });
    res.status(200).json(data);
    return;
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

router.delete("/:id", authCheck, async (req, res) => {
  try {
    if (!req.user.is_admin) {
      res.status(401).send("Access denied");
      return;
    }
    const deleteData = await prisma.users.delete({
      where: { id: Number(req.params.id) },
    });
    res.status(200).json(deleteData);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

async function loginCheck(req, res, next) {
  if (req.body.login) {
    const user = await prisma.users.findFirst({
      where: { login: req.body.login },
    });
    if (user && user.id != req.params.id) {
      res.status(400).send("Пользователь с таким именем уже существует!");
      return;
    }
  }
  next();
}

module.exports = router;
