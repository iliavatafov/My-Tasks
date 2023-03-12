const mongoose = require("mongoose");

const connectionString =
  "mongodb+srv://iliyavatafov:788900@cluster0.efup8nx.mongodb.net/?retryWrites=true&w=majority";

module.exports = async (app) => {
  try {
    mongoose.set("strictQuery", false);
    await mongoose.connect(connectionString, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("Database connected ...");

    mongoose.connection.on("error", (err) => {
      console.error("Database error");
      console.error(err);
    });
  } catch (err) {
    console.error("Error connecting to database");
    console.error(err);
    process.exit(1);
  }
};
