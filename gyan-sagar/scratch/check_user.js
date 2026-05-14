const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function checkUser() {
  const email = "itstudentcsit@gmail.com";
  const user = await prisma.user.findUnique({
    where: { email },
  });
  console.log("User found:", JSON.stringify(user, null, 2));
  await prisma.$disconnect();
}

checkUser().catch(console.error);
