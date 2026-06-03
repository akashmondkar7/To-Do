import express from 'express';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.set("view engine","ejs")

app.get("/",(req,resp)=>{
   resp.render("list")
})

app.get("/add",(req,resp)=>{
   resp.render("add")
})

app.get("/update",(req,resp)=>{
   resp.render("update")
})
const port = process.env.PORT;

app.listen(port,()=>{
    console.log(`Server Running on ${port}`)
})