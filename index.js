import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { MongoClient } from 'mongodb';
import { url } from 'inspector';

dotenv.config();

const app = express();
const publicPath= path.resolve('public')

app.use(express.static(publicPath));
app.set("view engine","ejs")


const dbName="node-project";

const collectionName="ToDoList";
const url ="mongodb://localhost:27017"
const client= new MongoClient(url)


app.get("/",(req,resp)=>{
   resp.render("list")
})

app.get("/add",(req,resp)=>{
   resp.render("add")
})

app.get("/update",(req,resp)=>{
   resp.render("update")
})
app.post("/update",(req,resp)=>{
   resp.redirect("/")
})
 
app.post("/add",(req,resp)=>{
   resp.redirect("/")
})


const port = process.env.PORT;

app.listen(port,()=>{
    console.log(`Server Running on ${port}`)
})