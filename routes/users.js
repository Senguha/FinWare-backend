const express = require("express");
const router = express.Router();
const prisma = require("../prisma/prismaClient");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const authCheck = require("../middleware/authCheck");

router.put("/:id", authCheck, loginCheck, async (req, res) => {
  try {
    if (!req.body.password) {
      const updateData = await prisma.users.update({
        where: { id: req.user.id },
        data: {
          login: req.body.login,
        },
      });
      res
        .status(200)
        .json({
          login: updateData.login,
          id: updateData.id,
          created_at: updateData.created_at,
          is_admin: updateData.is_admin,
        });
        return
    }

    const hashPass = await bcrypt.hash(req.body.password,10)

    const updateData = await prisma.users.update({
      where: { id: Number(req.user.id) },
      data: {
        password: hashPass,
      }
    });
    res
    .status(200)
    .json({
      login: updateData.login,
      id: updateData.id,
      created_at: updateData.created_at,
      is_admin: updateData.is_admin,
    });
  } 
  catch (err) {
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
    const token = jwt.sign({userId}, process.env.JWT_SECRET);
    res.cookie("jwt", token, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',         // if they are on the same domain, set this to 'strict'
      path: '/',
    });
    res
      .status(200)
      .json({
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
      return
    }
    const userId = user.id;
    const token = jwt.sign({userId}, process.env.JWT_SECRET);

    console.log(token);
    res.cookie("jwt", token, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',         // if they are on the same domain, set this to 'strict'
      path: '/',
    });
    res
      .status(200)
      .json({
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
    res.cookie("jwt", "", {maxAge: 0});  
    res.status(200).json({ message: "Выход из системы выполнен успешно" });
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
    if (user) {
      res.status(400).send("Пользователь с таким именем уже существует!");
      return;
    }
  }
  next();
}

module.exports = router;
