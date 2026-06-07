import express from "express";
import dotenv from "dotenv";
import path from "path";
import { MongoClient, ObjectId } from "mongodb";
import { title } from "process";

dotenv.config();

const app = express();
const publicPath = path.resolve("public");

app.use(express.static(publicPath));
app.set("view engine", "ejs");

const dbName = "node-project";

const collectionName = "ToDoList";
const url = "mongodb://localhost:27017";
const client = new MongoClient(url);

const connection = async () => {
  const connect = await client.connect();
  return connect.db(dbName);
};

app.use(express.urlencoded({ extended: false }));

app.get("/", async (req, resp) => {
  const db = await connection();
  const collection = db.collection(collectionName);
  const result = await collection.find().toArray();

  resp.render("list",{result});
});

app.get("/add", (req, resp) => {
  resp.render("add");
});

// Render update page for a specific task (id passed as URL param)

app.post("/add", async (req, resp) => {
  const db = await connection();
  const collection = db.collection(collectionName);
  const result = await collection.insertOne(req.body);
  if (result) {
    resp.redirect("/");
  } else {
    resp.redirect("/");
  }
});

app.post("/delete/:id", async (req, resp) => {
  const db = await connection();
  const collection = db.collection(collectionName);

  const result = await collection.deleteOne({
    _id: new ObjectId(req.params.id)
  });

  if (result.deletedCount > 0) {
    resp.redirect("/");
  } else {
    resp.send("Some error");
  }
});
app.get("/update/:id", async (req, resp) => {
  const db = await connection();
  const collection = db.collection(collectionName);

  const result = await collection.findOne({
    _id: new ObjectId(req.params.id)
  });

  if (result) {
    resp.render("update",{result});
  } else {
    resp.send("Some error");
  }
});
app.post("/update/:id", async (req, resp) => {
  const db = await connection();
  const collection = db.collection(collectionName);
  const filter={_id:new ObjectId(req.params.id)}
  const updateData={$set:{title:req.body.title,description:req.body.description}}
  const result = await collection.updateOne(filter,updateData);

  if (result) {
    resp.redirect("/");
  } else {
    resp.send("Some error");
  }
});

app.post("/multi-delete", async (req, resp) => {
  const db = await connection();
  const collection = db.collection(collectionName);
   let selectedTask = undefined;
  // support multiple checkbox name variants (selectedTask, selectTask, selectTask[])
  let ids = req.body.selectedTask || req.body.selectTask || req.body['selectTask[]'];
  if (!ids) {
    return resp.redirect('/');
  }
  if (!Array.isArray(ids)) ids = [ids];
  const objectIds = ids.map((id) => new ObjectId(id));

  const result = await collection.deleteMany({ _id: { $in: objectIds } });
  if (result && result.deletedCount >= 0) {
    resp.redirect("/");
  } else {
    resp.send("Some error");
  }
});


const port = process.env.PORT;

app.listen(port, () => {
  console.log(`Server Running on ${port}`);
});
