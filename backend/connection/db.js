const mongoose = require('mongoose');

const URI = "mongodb+srv://jadslim2:Jadslim2002@cluster2.01rm9tk.mongodb.net/Birdy?retryWrites=true&w=majority"

const connectDB = async() => {
    await mongoose.connect(URI, { useUnifiedTopology: true, useNewUrlParser: true })
    console.log("connected...!")
}

module.exports = connectDB;