const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;
const { client, seedData, createTables } = require("./db");
const router = require("./routes");

app.use(express.json());

(async () => {
  // connect to the database
  await client.connect();

  // NOTE that this is only for development and it will DROP all tables and recreate them
  // await createTables();
  // // Seed Data for the first time
  // await seedData();

  //
  app.use(router);

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
})();
