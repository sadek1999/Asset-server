const express = require('express');
const cors = require('cors');
const app=express()
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');


const port = process.env.PORT || 8080;


// middle wair
app.use(cors({
  origin:['http://localhost:5173',"https://irate-match.surge.sh"]
}))
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
    const emCollection=client.db('AssetDB').collection('employees')
    const reqCollection=client.db('AssetDB').collection('request')

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
    // api for employees.-----------------------------------------
    app.post('/employee',async(req,res)=>{
      const query=req.body;
      console.log(query)
      const result=await emCollection.insertOne(query)
      res.send(result)
    })
    app.get('/employee',async(req,res)=>{
      let query={};
      if(req.query?.email){
        query={email:req.query.email}
      }
      if(req.query?.role){
        query={role:req.query.role}
        // console.log(query)
      }
      if(req.query?.haired){
        
        
        query={haired:req.query.haired}
      }
      // console.log(query)

      const result=await emCollection.find(query).toArray()
      // console.log(result)
      res.send(result)
    })

    app.patch('/employee/:id',async(req,res)=>{
      const id=req.params.id;
       const email=req.body.hr;
      //  console.log(email)
      const query={_id:new ObjectId(id)}
      const update={
        $set:{
          haired:"true",
          hr:email
        }
      }
      const result=await emCollection.updateOne(query,update)
      res.send(result)
    })

    app.patch('/employee/remove/:id',async(req,res)=>{
      const id=req.params.id;
      
      const query={_id:new ObjectId(id)}
      const update={
        $set:{
          haired:"false",
          hr:''
        }
      }
      const result=await emCollection.updateOne(query,update)
      res.send(result)
    })
    


// Api for Assets--------------------------------------------------
    app.post('/asset',async(req,res)=>{
      const asset=req.body;
      const result=await assetCollection.insertOne(asset);
      res.send(result)
    })

    app.get("/asset",async(req,res)=>{
      let query={};
      if(req.query?.name){
        query={name:req.query.name}
      }
      if(req.query?.type){
        query={type:req.query.type}
      }
      // console.log(query)
    
      const result= await assetCollection.find(query).sort({ quantity: -1 }).toArray();
      res.send(result)
    })

    app.delete('/asset/:id',async(req,res)=>{
      const id=req.params.id;
      const query={_id:new ObjectId(id)}
      const result= await assetCollection.deleteOne(query);
      res.send(result)
    })

    // request API -------------------------------------------------------------

    app.post('/request',async(req,res)=>{
      const query=req.body;
      const result=await reqCollection.insertOne(query);
      res.send(result)

    })

    app.get('/request',async(req,res)=>{
      let query={}
      if(req.query?.state){
        query={state:req.query.state}
        
      }
      // console.log(query)
      const result=await reqCollection.find(query).toArray()
      res.send(result)
    })

    app.put('/request/:id',async(req,res)=>{
      const id=req.params.id;
     console.log(req.body)
      const query={_id:new ObjectId(id)}
      const update={
        $set:{
          state:req.body.do
        }
      }
      const result=await reqCollection.updateOne(query,update)
      res.send(result)
    })



    // await client.connect();
    
    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
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