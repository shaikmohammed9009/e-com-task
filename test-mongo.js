const { MongoClient, ServerApiVersion } = require('./backend/node_modules/mongodb');

const uri = "mongodb+srv://shaik9009:shaik9009@cluster0.2bjejjw.mongodb.net/Productapi?retryWrites=true&w=majority";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function testConnection() {
  try {
    // Connect to MongoDB
    await client.connect();
    console.log("Connected to MongoDB successfully!");
    
    // Get database and collections
    const db = client.db('Productapi');
    const collections = await db.listCollections().toArray();
    console.log("Available collections:", collections.map(c => c.name));
    
    // Test products collection
    const productsCollection = db.collection('products');
    const productCount = await productsCollection.countDocuments();
    console.log("Number of products:", productCount);
    
    await client.close();
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
}

testConnection();