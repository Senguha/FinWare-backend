const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcrypt')
const prisma = new PrismaClient();
const countries = require('./countries.json');
const params = require('./params.json');

async function main() {
  const hashPass = await bcrypt.hash("admin", 10);
  const admin = await prisma.users.upsert({
    where: { id: 1 },
    update: {},
    create: {
      login: "admin",
      password: hashPass,
      is_admin: true,
    },
  });
  const countr = await prisma.countries.createMany({data: countries.countries});
  const pars = await prisma.parametres.createMany({data: params.params});
}


main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
