import Yup from "yup";
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
export  default userValidationSchema;