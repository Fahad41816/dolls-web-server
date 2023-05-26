const express = require('express');
const app = express();
const cors = require('cors');

require('dotenv').config()
const PORT = process.env.PORT || 5000

// madleware
app.use(cors())
app.use(express.json())
 



const { MongoClient, ServerApiVersion, ObjectId} = require('mongodb');
const uri = `mongodb+srv://${process.env.DATABASEUSERNAME}:${process.env.DATABASEPASSWORD}@cluster0.c96z3.mongodb.net/?retryWrites=true&w=majority`;

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
    
  
    
    const Database = client.db("DollsDB").collection('doll')


    app.post('/Addtoy', async(req, res)=>{
       
        const userData = req.body;
        const result = await Database.insertOne(userData);
        res.send(result);         

    })

    app.get('/Alltoys', async(req, res)=>{
       
        const result = await Database.find().toArray() 
        res.send(result)
        
    })

    app.get('/Mytoys', async(req,res)=> {

        const user = req.query ;
        let query = {}
        if(user?.email){
            query = {sellerEmail : user.email};     
        }
        const result = await Database.find(query).toArray();
        res.send(result);    

    })
    app.get('/MytoysSort', async(req,res)=> {

        const user = req.query ;
        let query = {}
        if(user?.email){
            query = {sellerEmail : user.email};     
        }
        const result = await Database.find(query).sort({price : 1}).toArray();
        res.send(result);    

    })
    app.get('/toydetails/:id', async(req,res)=> {

        const id = req.params.id ;
        console.log(id)
        let query = {_id : new ObjectId(id)}
        
        const result = await Database.find(query).toArray();
        res.send(result);    

    })

    app.put('/MytoysUpdate/:id', async(req,res)=> {

        const id = req.params.id;        
        const updateuser = req.body
       console.log(updateuser)        
        const filter = {_id: new ObjectId(id)}        
        const options = { upsert: true }; 
        const updateDoc = {
            $set: {
              price: updateuser.price,
              quantity: updateuser.quantity,
              description : updateuser.description
            },
        };
        const result = await Database.updateOne(filter, updateDoc, options);
        res.send(result)

    })

    app.delete("/MytoysDelete/:id", async(req, res)=> {

        const id = req.params.id
        const query = {_id: new ObjectId(id)}
        const result = await Database.deleteOne(query);
        res.send(result)

    }) 

    





    // Send a ping to confirm a successful connection
    
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  } 
}
run().catch(console.dir); 


app.get('/', (req,res) => {
    res.send("<h1> Asssigment 11 </h1>")
});

app.listen(PORT, ()=> {
    console.log(`server listen ${PORT}`)
})