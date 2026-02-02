console.log('Testing MongoDB connection...');

const mongoose = require('mongoose');

// Try different connection strings
const uri1 = 'mongodb+srv://jobbadmin:jobadmin123@cluster0.uqg7l7y.mongodb.net/jobApplicationDB';
const uri2 = 'mongodb+srv://jobbadmin:jobadmin123@cluster0.uqg7l7y.mongodb.net/';

async function test() {
  try {
    console.log('Trying connection string 1...');
    await mongoose.connect(uri1, {
      serverSelectionTimeoutMS: 10000
    });
    console.log('✅ SUCCESS with URI 1!');
    
    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    console.log('Collections:', collections.length > 0 ? collections.map(c => c.name) : 'No collections');
    
    await mongoose.disconnect();
    console.log('Test completed!');
    process.exit(0);
    
  } catch (err1) {
    console.log('❌ Failed with URI 1:', err1.message);
    
    try {
      console.log('\nTrying connection string 2...');
      await mongoose.connect(uri2, {
        serverSelectionTimeoutMS: 10000
      });
      console.log('✅ SUCCESS with URI 2!');
      
      await mongoose.disconnect();
      console.log('Use this connection string in .env.local');
      console.log('MONGODB_URI=' + uri2);
      process.exit(0);
      
    } catch (err2) {
      console.log('❌ Failed with both URIs:', err2.message);
      console.log('\nCheck:');
      console.log('1. MongoDB Atlas cluster is running (green status)');
      console.log('2. IP 0.0.0.0/0 is in Network Access');
      console.log('3. User jobbadmin exists in Database Access');
      process.exit(1);
    }
  }
}

test();