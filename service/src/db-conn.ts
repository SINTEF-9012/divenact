const mongoose = require('mongoose');

const { DB_CONN, DB_USER, DB_PW } = process.env;

const connect_db = async () => {
    if(DB_CONN == "mongodb://localhost:27017/mockupdb"){
        const { MongoMemoryServer } = require('mongodb-memory-server');

        const mongod = new MongoMemoryServer();
        const uri = await mongod.getConnectionString();
        console.log(uri)
        mongoose.connect(
            uri,
            { 
                useNewUrlParser: true 
            },
        )
        .then(() => console.log('Successfully connected to the memory DB'))
        .catch(console.error);
    }
    else{
        mongoose.connect(
            DB_CONN,
            { 
                useNewUrlParser: true 
            },
        )
        .then(() => console.log('Successfully connected to the DB'))
        .catch(console.error);
    }
}

connect_db()

// Simple use for local mongodb
// mongoose.connect(
//     DB_CONN + "?ssl=true&replicaSet=globaldb",
//     { 
//         auth: { user: DB_USER, password: DB_PW }, 
//         useNewUrlParser: true 
//     },
// )
