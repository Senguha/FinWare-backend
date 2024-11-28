const jwt = require("jsonwebtoken");
const prisma = require("../prisma/prismaClient");

const authCheck = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;

    if (!token) return res.status(401).send("Access denied");

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded) return res.status(401).send("Access denied");


    const user = await prisma.users.findUnique({
      where: { id: Number(decoded.userId) },
    });
    if (!user) return res.status(401).send("Access denied");

    req.user = user;
    next();
  } catch (error) {
    console.log(error);
    res.status(401).send("Access denied");
  }
};

module.exports = authCheck;
