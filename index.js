const express = require('express')
const app = express()
var cors = require('cors')
require("dotenv").config();
const port = process.env.PORT ||5000
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

// Middle wear
app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.3jc4d.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run(){
    try {
        await client.connect();
        const dataCollection = client.db('ToDo-app').collection('data')

        // ///////////////////////      Get all data    ///////////////////
        app.get('/data', async (req, res) => {
            const data = await dataCollection.find().toArray()
            res.send(data)
        })

        // //////////////////////      Post new data       /////////////////////
        app.post('/data', async (req, res) => {
            const query = req.body
            const addData = await dataCollection.insertOne(query)
            res.send(addData)
        })

        // ////////////////////         Delete data        ////////////////

        app.delete('/data/:id', async (req, res) => {
            const id = req.params.id
            const filter ={_id: ObjectId(id)} 
            const data = await dataCollection.deleteOne(filter)
            res.send(data)
    })

    }
    finally {
        // await client.close()
    }
}
run().catch(console.dir)



app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})