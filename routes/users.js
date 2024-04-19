const express = require("express");
const router = express.Router();
const prisma = require("../prisma/prismaClient");

router.put("/:id", loginCheck, async (req, res) => {
  try {
    const Data = req.body;
    const updateData = await prisma.users.update({
      where: { id: Number(req.params.id) },
      data: {
        login: Data.login,
        password: Data.password,
      }
    });
    res.status(200).json(updateData);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});
router.post("/",loginCheck, async (req, res) => {
  try {
    const Data = req.body;
      const createData = await prisma.users.create({
        data: {
            login: Data.login,
            password: Data.password,
        },
      });
      res.status(200).json(createData);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

router.get("/login", async (req,res)=>{
    try {
        const Data = req.body;
        const auth = await prisma.users.findUnique({
            where:{
                login: Data.login,
                password: Data.password,
            }
        })
        auth ? res.status(200).send() : res.status(401).send("Ваш логин и/или пароль введены неверно")
    } catch (error) {
        console.log(err);
        res.sendStatus(500);
    }
})

async function loginCheck(req,res,next){
    if (req.body.login){
        const user = await prisma.users.findFirst({
            where:{login: req.body.login},
        })
        if (user){
            res.status(400).send("Пользователь с таким именем уже существует!")
            return;
        }
    }
    next()
}

module.exports = router;
