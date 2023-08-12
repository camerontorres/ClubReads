const mongoose = require("mongoose");






const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.DB_STRING, {
      /*useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true,
      ************
      connect-mongo was uninstalled from npm and replaced with npm i connect-mongo@3. 
      from reading stack overflow it appears the above code is not neccecary for the app to run but I am keeping it 
      here in the event of needing to replace the current connect-mongo version
      ************/
    });
    
    

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }

  
};
const gracefulShutdown = () => {
  mongoose.connection.close();
    console.log('MongoDB connection closed.');
    process.exit(0); // Exit the process after closing the connection
  ;
};

// Listen for termination or interrupt signals
process.on('SIGINT', gracefulShutdown);
process.on('SIGTERM', gracefulShutdown);



module.exports = connectDB 
