const express = require('express');
const cors = require('cors');
const app=express()
require('dotenv').config()
const { MongoClient, ServerApiVersion } = require('mongodb');


const port = process.env.PORT || 8080;


// middle wair
app.use(cors())
app.use(express.json())







const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.xtmekud.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    }
  });

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    const assetCollection = client.db('AssetDB').collection('assets')
    const userCollection=client.db('AssetDB').collection('users')

    // Api for user-----------------------------------
    // -------------------------------------------------
    app.post('/user',async(req,res)=>{
      const user=req.body;
      const result=await userCollection.insertOne(user);
      res.send(result)
    })
    app.get('/user',async(req,res)=>{
      let query={};
      if (req.query?.email) {
        query = { email: req.query.email }
      }
      const result=await userCollection.find(query).toArray()
      res.send(result)
    })
    


// Api for Assets--------------------------------------------------
    app.post('/asset',async(req,res)=>{
      const asset=req.body;
      const result=await assetCollection.insertOne(asset);
      res.send(result)
    })
    app.get("/asset",async(req,res)=>{
    
      const result= await assetCollection.find().sort({ quantity: -1 }).toArray();
      res.send(result)
    })



    await client.connect();
    
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);




app.get('/', (req, res) => {
    res.send('Asset is  mangeable')
})

app.listen(port, () => {
    // console.log('boss is harer')
})