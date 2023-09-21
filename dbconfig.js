const mongoose = require('mongoose');

require("dotenv").config()


mongoose.connect(process.env.MONGO_DB_URI)
  .then(() => {
    console.log('Mongoose connection successful!');
  })
  .catch((err) => {
    console.log('Mongoose connection error:', err);
  });

/* connection option:
 {
  serverSelectionTimeoutMS: 5000
}
 */

setTimeout(()=>{
  if (mongoose.connection.readyState !== 1) {
    console.log('Mongoose connection is not connected yet! three seconds passed.');
    console.log("Current Connection status: ",mongoose.connection.readyState ); 
  }
}, 3000)

