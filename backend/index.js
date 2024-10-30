const port = 4000;
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const multer = require("multer");

const path = require("path");
const cors = require("cors");
const fs = require("fs");
const bodyparser = require("body-parser"); //for collecting form data
const { type } = require("os");
const { error } = require("console");

//---------These Libry For File Upload Any Type--------
// Upload the Destination Location
// Handle The File Type and Read
// Find The Where you Want To Store
//---------------------End---------------------

app.use(bodyparser.urlencoded({ extended: false })); //express td set the body-parser
app.use(express.json());
app.use(cors());

//data base connection with mongodb
const uri =
  "mongodb+srv://mamtarani172001:mamta0017@cluster0.w3kcj.mongodb.net/Ecommerce-website?retryWrites=true&w=majority&appName=Cluster0";
mongoose
  .connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.error("MongoDB connection error:", err));

//API creation
app.get("/", (req, res) => {
  res.send("express app is running ");
});

//multer image storage engine
// Set up Multer for file upload
// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         const uploadDir = './uploads/images';
//         if (!fs.existsSync(uploadDir)){
//             fs.mkdirSync(uploadDir);
//         }
//         cb(null, uploadDir);
//     },
//     filename: function (req, file, cb) {
//         cb(null, Date.now() + path.extname(file.originalname)); // unique file name (images or any kind of file)
//     }
// });
// const upload = multer({ storage: storage });

const storage = multer.diskStorage({
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit to 5MB
  destination: "./uploads/images",

  filename: (req, file, cb) => {
    return cb(
      null,
      `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`
    );
  },
});
const upload = multer({ storage: storage });

//creating upload endpoint of images
app.use("/images", express.static("/uploads/images"));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// app.post("/uploads",upload.single('product'),(req,res)=>{

//     res.json({
//         sucess:1,
//         image_url:`http://localhost:${port}/images/${req.file.filename}`
//     })
// })

//schema

app.post("/uploads", upload.single("image"), (req, res) => {
  console.log(req.file, "req.body in uploads");
  if (!req.file) {
    return res
      .status(400)
      .json({ success: false, message: "No file uploaded" });
  }
  // Handle file processing
  res.json({
    success: true,
    image_url: `http://localhost:${port}/uploads/images/${req.file.filename}`,
  });
});

const Product = mongoose.model("Product", {
  id: {
    type: Number,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  new_price: {
    type: Number,
    required: true,
  },
  old_price: {
    type: Number,
    required: true,
  },
  date: {
    type: String,
    default: Date.now,
  },
  available: {
    type: Boolean,
    default: true,
  },
});
//add products created
app.post("/addproduct", async (req, res) => {
  console.log("inside add product");
  let products = await Product.find({});
  console.log(products, "products");
  console.log(req.body, "req.body");
  let id;
  if (products.length > 0) {
    let last_product_array = products.slice(-1);
    console.log(last_product_array, "last_product_array");
    let last_product = last_product_array[0];
    console.log(last_product, "last_product");
    id = last_product.id + 1;
  } else {
    id = 1;
  }
  const product = new Product({
    id: id,
    name: req.body.name,
    image: req.body.image,
    category: req.body.category,
    new_price: req.body.new_price,
    old_price: req.body.old_price,
  });
  console.log(product, "All product list after adding product");
  await product.save();
  console.log("saved");

  res.json({
    sucess: 1,
    name: req.body.name,
  });
});

//creating api for remove product
app.post("/removeproduct", async (req, res) => {
  await Product.findOneAndDelete({ id: req.body.id });
  console.log("remove");
  res.json({
    sucess: true,
    name: req.body.name,
  });
});

//creating api for getting all products
app.get("/allproducts", async (req, res) => {
  let products = await Product.find({});
  console.log("all products fetched");
  res.send(products);
});

//schema creating for user model

const Users = mongoose.model("User", {
  name: {
    type: String,
  },
  email: {
    type: String,
    unique: true,
  },
  password: {
    type: String,
  },
  cartData: {
    type: Object,
  },
  Date: {
    type: Date,
    default: Date.now,
  },
});

//creating endpoint for registering the user
app.post("/signup", async (req, res) => {
  let check = await Users.findOne({ email: req.body.email });
  if (check) {
    return res.status(400).json({ success: false,
        errors: "existing user found with same email id ",
      });
  }
  let cart = {};
  for (let i = 0; i < 300; i++) {
    cart[i] = 0;
  }
  const user = new Users({
    name: req.body.username,
    email: req.body.email,
    password: req.body.password,
    cartData: cart,
  });
  await user.save();

  const data = {
    user: {
      id: user.id,
    },
  };
  const token = jwt.sign(data, "secret_ecom");
  res.json({ success: true, token });
});

//creating endpoint for user login

app.post("/login", async (req, res) => {
  let user = await Users.findOne({ email: req.body.email });
  if (user) {
    const passCompare = req.body.password === user.password;
    if (passCompare) {
      const data = {
        user: {
          id: user.id,
        },
      };
      const token = jwt.sign(data, "secret_ecomp");
      res.json({ success: true, token });
    } else {
      res.json({ success: false, error: "wrong password" });
    }
  } else {
    res.json({ success: false, error: "wrong email id " });
  }
});

//creating end point for neww collection
app.get("/newcollection", async (req, res) => {
  let products = await Product.find({});
  let newcollection = products.slice(1).slice(-8);
  console.log("newcollection fetched");
  res.send(newcollection);
});

//creating end point for popular in women section
app.get("/popularinwomen", async (req, res) => {
  let products = await Product.find({ category: "womens" });
  let popular_in_women = products.slice(0, 4);
  console.log("poupular in women fetched");
  res.send(popular_in_women);
});

//creating middleware to fetch user
const fetchUser = async (req, res, next) => {
  const token = req.header("auth-token");
  if (!token) {
    res.status(401).send({ errors: "please authenticate using valid token" });
  } else {
    try {
      const data = jwt.verify(token, "secret_ecom");
      req.user = data.user;
      next();
    } catch (error) {
      console.error(error);
      res
        .status(401)
        .send({ errors: "please authenticate using a valid token" });
    }
  }
};

//creating end point for adding products in cart data

app.post("/addtocart", fetchUser, async (req, res) => {
  console.log(req.body, req.user);
  console.log("added", req.body.itemId);

  let userdata = await Users.findOne({ _id: req.user.id });
  console.log(userdata);

  userdata.cartData[req.body.itemId] += 1;
  await Users.findOneAndUpdate(
    { _id: req.user.id },
    { cartData: userdata.cartData }
  );
  res.send("added");
});


//creating end point to remove product from cartdata
app.post("/removefromcart", fetchUser, async (req, res) => {
  console.log("removed", req.body.itemId);

  let userdata = await Users.findOne({ _id: req.user.id });
  console.log(userdata);
  if (userdata.cartData[req.body.itemId] > 0)
    userdata.cartData[req.body.itemId] -= 1;
  await Users.findOneAndUpdate(
    { _id: req.user.id },
    { cartData: userdata.cartData }
  );
  res.send("remove data");
});

//creating endpoint to get cartdata
app.post("/getcart", fetchUser, async (req, res) => {
  console.log("GetCart");
  let userData = await Users.findOne({ _id: req.user.id });
  res.json(userData.cartData);
});


//to get into link
app.listen(port, (error) => {
  if (!error) {
    console.log(`click here :http://localhost:${port}`);
  } else {
    console.log(error);
  }
});






