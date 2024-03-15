const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const {client, seedData} = require('./db');

app.use(express.json());




(async () => {
    // connect to the database
    await client.connect();

    // Seed Data for the first time
    // await seedData();


    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    }
    
    );
    
})();

