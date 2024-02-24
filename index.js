const express=require("express")
const app=express()
const mongoose=require("mongoose")
const dontenv=require("dotenv")
const userRouter=require("./Router/user")
dontenv.config()
mongoose.connect(process.env.MONGOURL)
    .then(() => {
        console.log("MongoDB connected");
    })
    .catch((err) => {
        console.error("Error connecting to MongoDB:", err);
    });

app.use(express.json())
app.use("/api/user",userRouter)
app.listen(5000,()=>{
    console.log("server is running..");
})