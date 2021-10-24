const express = require("express");
const { MongoClient } = require("mongodb");
const ObjectId = require("mongodb").ObjectId;
const cors = require("cors");
require("dotenv").config();

const app = express();
// port
const port = 5000;

// middle ware
app.use(cors());
app.use(express.json());

// connect to database
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.amqnd.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

async function run() {
    try {
        await client.connect();
        const database = client.db("carMechanic");
        const servicesCollection = database.collection("services");

        // GET API
        app.get("/services", async (req, res) => {
            const cursor = servicesCollection.find({});
            const services = await cursor.toArray();
            res.send(services);
        });

        //  GET SINGLE SERVICE
        app.get("/service/:id", async (req, res) => {
            const id = req.params.id;
            console.log("Getting specific service", id);
            const query = { _id: ObjectId(id) };
            const service = await servicesCollection.findOne(query);
            res.json(service);
        });

        // POST API
        app.post("/services", async (req, res) => {
            const service = req.body;
            console.log("hit the post api", service);

            const result = await servicesCollection.insertOne(service);
            console.log(result);
            res.send(result);
        });

        // DELETE API
        app.delete("/service/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await servicesCollection.deleteOne(query);
            res.json(result);
        });
    } finally {
        // await client.close()
    }
}
// call run func
run().catch(console.dir);

app.get("/", (req, res) => {
    res.send("Running Genius server");
});

app.listen(port, () => {
    console.log("Running Genius server on port", port);
});
