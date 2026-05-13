const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  await prisma.user.updateMany({
    data: {
      emailVerified: new Date(),
    }
  });
  console.log("All users have been manually verified.");
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());
