import express from "express";
import mongoose from "mongoose";
import dbConnect from "./db.connection.js";
import {userController} from "./user/user.controller.js";
import { productController } from "./product/product.controller.js";
import cors from "cors"
//backend app 
const app = express();

//to make app understand
app.use(express.json());
app.use(cors());

//database connections
dbConnect();

//register routes
app.use(userController);
app.use(productController);




//network port
const PORT=8000;

app.listen(PORT, () => {
  console.log(`App is listening on port $(PORT)`);
});