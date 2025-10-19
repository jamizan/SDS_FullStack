require('dotenv').config({ path: '../.env' });

const PASS = process.env.MONGO_PASS;
const USER = process.env.MONGO_USER;

// Add debugging to verify environment variables are loaded
console.log('USER:', USER);
console.log('PASS:', PASS ? '***loaded***' : 'undefined');

const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${USER}:${PASS}@cluster0.sg37s6q.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
    // Connect the client to the server
    await client.connect();
    console.log("Connected to MongoDB!");
    
    const collection = client.db("sample_mflix").collection("comments");

    const pipeline = [
        {
            '$match': {
                'name': 'Taylor Scott'
            }
        }, {
            '$count': 'taylorComments'
        }
    ];
    
    const agg = await collection.aggregate(pipeline).toArray();
    console.log(agg);

  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}

run();