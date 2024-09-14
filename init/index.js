const mongoose = require('mongoose');
const Listing = require('../models/listing.js');
const InitData = require('./data.js');


const URL = "mongodb://127.0.0.1:27017/wanderlust";
main()
.then(()=>{
    console.log("Connection to DB");
}).catch((err)=>{
    console.log(err);
});
async function main(){
    await mongoose.connect(URL);
}

const initDB = async () =>{
    await Listing.deleteMany({});
    await Listing.insertMany(InitData.data);
    console.log("data was save" );
}
initDB();
