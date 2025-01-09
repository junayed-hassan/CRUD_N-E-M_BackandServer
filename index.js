// Purpose: Server-side code for MongoDB connection and API endpoints
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection URI
const uri = `mongodb+srv://${process.env.SECRET_USER}:${process.env.SECRET_KEY}@cluster0.y2gfe.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

// Database and Collection References
let coffeeCollection;

async function run() {
  try {
    // Connect the client to the server
    await client.connect();
    console.log("Connected to MongoDB!");

    // Reference the collection
    const database = client.db("coffeeDB"); // Replace 'coffeeDB' with your database name
    coffeeCollection = database.collection("coffees"); // Replace 'coffees' with your collection name
    usersCollection = database.collection("users"); // Replace 'users' with your collection name

    // GET route to retrieve all coffees
    app.get("/coffees", async (req, res) => {
      try {
        const cursor = coffeeCollection.find({});
        const coffees = await cursor.toArray();
        res.status(200).send(coffees);
      } catch (error) {
        console.error("Error getting coffees:", error);
        res.status(500).send({ message: "Internal Server Error" });
      }
    });

    // GET  route to retrieve a coffee
    app.get("/coffee/:id", async (req, res) => {
      try {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) };
        const result = await coffeeCollection.findOne(query);
        res.send(result);
      } catch (error) {
        console.error("Error getting coffee:", error);
        res.status(500).send({ message: "Internal Server Error" });
      }
    });

    // POST route to add new coffee
    app.post("/coffees", async (req, res) => {
      try {
        const coffee = req.body;
        const result = await coffeeCollection.insertOne(coffee);
        res.status(201).send(result); // Send back the inserted document info
      } catch (error) {
        console.error("Error inserting coffee:", error);
        res.status(500).send({ message: "Internal Server Error" });
      }
    });

    // PUT route to updata a coffee by id
    app.put("/coffee/:id", async (req, res) => {
      try {
        const coffee = req.body;
        const id = req.params.id;
        const filter = { _id: new ObjectId(id) };
        const options = { upsert: true };
        const updateObject = {
          $set: {
            name: coffee.name,
            price: coffee.price,
            category: coffee.category,
            chef: coffee.chef,
            supplier: coffee.supplier,
            taste: coffee.taste,
            photoUrl: coffee.photoUrl,
            details: coffee.details,
          },
        };
        const result = await coffeeCollection.updateOne(
          filter,
          updateObject,
          options
        );
        res.send(result);
      } catch (error) {
        console.error("Error inserting coffee:", error);
        res.status(500).send({ message: "Internal Server Error" });
      }
    });

    // DELETE route to delete a coffee by id
    app.delete("/coffees/:id", async (req, res) => {
      try {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) };
        const result = await coffeeCollection.deleteOne(query);
        res.send(result);
      } catch (error) {
        console.error("Error inserting coffee:", error);
        res.status(500).send({ message: "Internal Server Error" });
      }
    });

    // POST route to add new users
    app.post("/users", async (req, res) => {
      const user = req.body;
      const result = await usersCollection.insertOne(user);
      res.send(result);
    });

    // GET route to retrieve all users
    app.get("/users", async (req, res) => {
      try {
        const cursor = usersCollection.find({});
        const users = await cursor.toArray();
        res.status(200).send(users);
      } catch (error) {
        console.error("Error getting users:", error);
        res.status(500).send({ message: "Internal Server Error" });
      }
    });

    // DELETE route to delete a users by id
    app.delete("/users/:id", async (req, res) => {
      try {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) };
        const result = await usersCollection.deleteOne(query);
        res.send(result);
      } catch (error) {
        console.error("Error inserting users:", error);
        res.status(500).send({ message: "Internal Server Error" });
      }
    });

    // PUT route a users
    app.patch("/users", async (req, res) => {
      try {
        const user = req.body;
        const email = user.email;
        const query = {email};
        const updateObject = {
          $set: {
            lastLoginAt: user.lastLoginAt
          }
        };
        const result = await usersCollection.updateOne(
          query,
          updateObject,
        );
        res.send(result);
      } catch (error) {
        console.error("Error inserting coffee:", error);
        res.status(500).send({ message: "Internal Server Error" });
      }
    });

    // Additional Routes/Endpoints can be added here
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
}

run();

// Root Route
app.get("/", (req, res) => {
  res.send("Welcome to Server Side");
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
