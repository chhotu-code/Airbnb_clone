const express = require("express");
const app = express();
const mongoose = require("mongoose");
// const ejs = require("ejs");
const Listing = require("./models/listing.js");
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const wrapAsync = require('./utils/wrapAsync.js')
const ExpressError = require('./utils/ExpressError.js')
const { listingSchema } = require( "./listingSchema.js");

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine('ejs',ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

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

const validatingListing = (req,res,next) =>{
    let {error} = listingSchema.validate(req.body); 
    if(error){
        let errMess = error.details.map((el) => el.message).join(",");
        throw new ExpressError(404,errMess)
       }else{
        next();
       }

}
// app.get("/testListing",async (req,res)=>{
//     let sampleListing = new Listing({
//         title:"my new Villa",
//         description:"By the beanch",
//         price:1200,
//         location:"Goa",
//         country:"India",
//     });
//     await sampleListing.save();
//     console.log("sample was save");
//     res.send("Successfully");
// })


app.get("/",(req,res)=>{
    res.send("HeY this is me");
});

//this is index route
app.get("/listings",
validatingListing,
wrapAsync( async (req,res)=>{
    const alllisting = await Listing.find({});
    res.render("listings/index.ejs",{alllisting});
    // res.send("thirhiu");
}))

//create route for addd
app.get("/listings/new",(req,res)=>{
    res.render("listings/new.ejs");
});

app.post("/listings", validatingListing, wrapAsync (async (req,res,next)=>{
   const result = listingSchema.validate(req.body);
   
    const newData = new  Listing(req.body.listing);
    await newData.save();
    res.redirect("listings");

})
);



app.get("/listings/:id", validatingListing, wrapAsync(async (req,res)=>{
    let {id} =  req.params;
    const data  = await Listing.findById(id);
    res.render("listings/show.ejs",{data});

}))

//edit route
app.get("/listings/:id/edit", validatingListing,wrapAsync(async (req,res)=>{
    let {id} =  req.params;
    const data  = await Listing.findById(id);
    res.render("listings/edit.ejs",{data});
}))

app.patch("/listings/:id",validatingListing, wrapAsync(async (req,res)=>{
    let {id} =  req.params;
    if(!req.body.listing){
        throw new ExpressError(400,"send valid data ")
    }
     await Listing.findByIdAndUpdate(id,{...req.body.listing});
    res.redirect(`/listings/${id}`);
}))

//delete listing route
app.delete("/listings/:id",validatingListing, wrapAsync( async (req,res)=>{
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);~
    res.redirect("/listings");
}))

app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"Page Not Found"))
})

//define middeware
app.use((err,req,res,next)=>{
    let{status = 505,message="Something went wrong!"} = err;
    // res.status(status).send(message);
    res.render('listings/error.ejs',{message});
})

app.listen(3030,()=>{
    console.log("server is started...........");
})