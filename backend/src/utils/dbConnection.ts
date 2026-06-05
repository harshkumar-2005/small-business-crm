import { prisma } from "../utils/prisma.js";

async function checkConnection() {
  try {
    // Attempting a simple raw query to verify the database responds
    await prisma.$queryRaw`SELECT 1`;
    console.log("Database connection is successful!");
  } catch (error) {
    console.error("Failed to connect to the database:", error);
  } finally {
    await prisma.$disconnect();
  }
}

export default checkConnection;