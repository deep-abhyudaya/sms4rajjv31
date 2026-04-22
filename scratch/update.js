const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
prisma.admin.updateMany({ data: { username: 'de3p' } }).then(console.log).finally(() => prisma.$disconnect());
