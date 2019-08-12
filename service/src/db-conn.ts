const mongoose = require('mongoose');

const { DB_CONN, DB_USER, DB_PW } = process.env;

// Simple use for local mongodb
// mongoose.connect(
//     DB_CONN + "?ssl=true&replicaSet=globaldb",
//     { 
//         auth: { user: DB_USER, password: DB_PW }, 
//         useNewUrlParser: true 
//     },
// )
mongoose.connect(
    DB_CONN,
    { 
        useNewUrlParser: true 
    },
)
.then(() => console.log('Successfully connected to the DB'))
.catch(console.error);