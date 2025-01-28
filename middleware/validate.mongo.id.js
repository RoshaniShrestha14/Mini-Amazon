 import mongoose from "mongoose";
 
 
 const validateMongoIdFromParams=(req, res, next)=>{
 const productId = req.params.id;

    const productIDIsValid = mongoose.isValidObjectId(productId);

    if (!productIDIsValid) {
      return res.status(400).send({ message: 'Invalid product id.' });
    }

    next();
};

export {validateMongoIdFromParams}