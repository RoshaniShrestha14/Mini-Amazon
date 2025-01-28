import express from "express";
import ProductTable from "./product.model.js";
import Yup from "yup";
import userValidationSchema from "./product.validation.js";
import mongoose  from "mongoose";
import jwt from "jsonwebtoken";
import isUser from "../middleware/authentication.middleware.js";
import {validateMongoIdFromParams} from '../middleware/validate.mongo.id.js';



const router= express.Router();

//add product
router.post("/productAmazon/add", isUser,
    async(req, res,next)=>{
      //create schema
      try{
        req.body= await userValidationSchema.validate(req.body);
        next();
      }catch(error){
        return res.status(400).send({message:error.message});
      }
    },
    async(req, res)=>{
        //extract the product from the req body
        const newProduct=req.body;
        // add product
        await ProductTable.create(newProduct);
 

    return res.status(201).send({message:"Product is added successfully", productList:newProduct});
});







// get product by id
router.get(
  '/productAmazon/detail/:id', isUser,
  validateMongoIdFromParams,
  async (req, res) => {
    // extract product id from req.params
    const productId = req.params.id;

    // find product
    const product = await ProductTable.findOne({ _id: productId });

    // if not product, throw error
    if (!product) {
      return res.status(404).send({ message: 'Product does not exist.' });
    }

    return res.status(200).send({ message: 'success', productDetails: product });
  }
);

// delete product by id
router.delete("/productAmazon/delete/:id", isUser,
  (req, res, next)=>{
 const productId= req.params.id;
  const isValidId = mongoose.isValidObjectId(productId);
    if (!isValidId) {
      return res.status(400).send({ message: "Invalid object id." });
    }

next();

},
async (req, res) => {
  try{
    const productId =req.params.id;

  //   find product
  const product= await ProductTable.findOne({ _id: productId });

  //   if not product, throw error
  if (!product) {
    return res.status(404).send({ message: "Product does not exist." });
  }

  //   delete product
  await product.deleteOne({ _id: productId });

  //   send res
  return res.status(200).send({ message: "Product is deleted successfully." });
} catch(error){
  return res.status(500).send({ message: "Internal server error", error: error.message });

}
});

//get product detail
router.post(
  "/productAmazon/list",
  isUser,
  async (req, res, next) => {
    const paginationSchema = Yup.object({
      page: Yup.number().positive().integer().default(1),
      limit: Yup.number().positive().integer().default(10),
    });

    try {
      req.body = await paginationSchema.validate(req.body);
    } catch (error) {
      return res.status(400).send({ message: error.message });
    }
    next();
  },
  async (req, res) => {
    // extract page and limit from req.body
    const paginationData = req.body;

    const limit = paginationData.limit;
    const page = paginationData.page;

    const skip = (page - 1) * limit;

    const products = await ProductTable.aggregate([
      {
        $match: {},
      },

      { $skip: skip },
      { $limit: limit },
    ]);

    const totalItem = await ProductTable.find().countDocuments();

    const totalPage = Math.ceil(totalItem / limit);

    return res
      .status(200)
      .send({ message: "success", productList: products, totalPage });
  }
);


router.put("/productAmazon/edit/:id", 
  isUser,
  validateMongoIdFromParams,
  async(req, res, next)=>{
    const userValidationSchema = Yup.object({
      name: Yup.string().required().trim().max(155),
      brand: Yup.string().required().trim().max(155),
      price: Yup.number().required().min(0),
      quantity: Yup.number().required().min(1),
      category: Yup.string()
        .required()
        .trim()
        .oneOf([
          "Grocery",
          "Electronics",
          "Electrical",
          "Clothing",
          "Kitchen",
          "Kids",
          "Laundry",
        ]),
    
      image: Yup.string().notRequired().trim(),
    });
    try{
        req.body= await userValidationSchema.validate(req.body);
        next();
      }catch(error){
        return res.status(400).send({message:error.message});
      }
   
  },
     async(req, res)=>{
        //extract the product from the req body
        const productId=req.params.id;
        const product = await ProductTable.findOne({_id:productId}) ;  
        if(!product){
          return res.status(404).send({message:"Product does not exists"})
        }

        //extract new values from req.body
        const newValues = req.body;
        await ProductTable.updateOne(
          { _id: productId },
          {
            $set: {
              name: newValues.name,
              brand: newValues.brand,
              price: newValues.price,
              quantity: newValues.quantity,
              category: newValues.category
            },
          }
        );   return res
          .status(200)
          .send({ message: "Product is updated successfully" });

    

  }
)


export {router as productController};