import client from "../src/index"; // Adjust the import based on your project structure

async function main() {
  const users = await client.user.findMany();

  // Create a balance entry for each user
  for (const user of users) {
    await client.balance.create({
      data: {
        userId: user.id,
        amount: 0, // Default balance or any initial amount
        locked: 0,
      },
    });
  }

  console.log("Balances seeded successfully.");
}

main()
  .then(() => {
    console.log("Seeding completed.");
  })
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await client.$disconnect();
  });
