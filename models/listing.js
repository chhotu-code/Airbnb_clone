const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
    title:{
        type:String,
        require:true,
    },
    description:{
        type:String,
    },
    image:{
        type:String,
        default: "https://cdn.theatlantic.com/thumbor/NBykZNyWAL8Btwo87EWrqIrcIKU=/0x72:2000x1113/960x500/media/img/photo/2017/06/winners-of-the-red-bull-illume-phot/r01_MA16_015301_013666-1/original.jpg",
        set: (v) => v === ""?"https://cdn.theatlantic.com/thumbor/NBykZNyWAL8Btwo87EWrqIrcIKU=/0x72:2000x1113/960x500/media/img/photo/2017/06/winners-of-the-red-bull-illume-phot/r01_MA16_015301_013666-1/original.jpg":v,
    },
    price:{
        type:Number,
    },
    location:{
        type:String,
    },
    country:{
        type:String,
    }
});
const Listing = mongoose.model("Listing ", listingSchema);
module.exports = Listing;