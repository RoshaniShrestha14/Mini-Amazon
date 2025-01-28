import mongoose from "mongoose";

//set a schema/ rule/ structure
const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxLength: 255,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  brand: {
    type: String,
    required: true,
    trim: true,
    maxLength: 255,
  },
  category: {
    type: String,
    required: true,
    trim: true,
    enum: [
      "Grocery",
      "Electronics",
      "Electrical",
      "Clothing",
      "Kitchen",
      "Kids",
    ],
  },
  image: {
    type: String,
    required: false,
    trim: true,
  },
  quantity: {
    type: String,
    required: true,
    min:1,
  },
},
  {
    timestamps: true,
  }
);
//create model/table/collection
const ProductTable= mongoose.model('Product', productSchema);

export default ProductTable;
