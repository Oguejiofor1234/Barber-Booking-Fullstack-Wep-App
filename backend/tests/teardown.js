// Jest globalTeardown — runs once after all test suites.
// Disconnects the shared Prisma singleton so Jest can exit without --forceExit.
module.exports = async () => {
  if (global._prisma) {
    await global._prisma.$disconnect();
  }
};
