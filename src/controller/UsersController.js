// user create

const UserModel = require("../models/usersModel");
const jwt = require("jsonwebtoken");

// reg start
exports.registration = async (req, res) => {
  const data = req.body;

  try {
    const user = await UserModel.create(data);
    res.status(201).json({ status: "success", data: user });
  } catch (error) {
    res.status(400).json({ status: "fail", message: error.message });
    console.log("user not created");
  }
};
// reg end

// login start

exports.login = async (req, res) => {
  try {
    const reqBody = req.body;
    const user = await UserModel.findOne({ email: reqBody.email });
    // console.log(user);

    if (!user) {
      res.status(400).json({ status: "fail", message: "user not found" });
    }

    if (user && user.password !== reqBody.password) {
      res.status(400).json({ status: "fail", message: "wrong password" });
    }

    if (user && user.password === reqBody.password) {
      // token start

      const payload = {
        exp: Date.now() + 1000 * 60 * 60,
        data: user["email"],
      };

      const token = jwt.sign(payload, "123456789");

      res.status(200).json({ status: "success", data: user, token: token });
    }
  } catch (error) {
    console.log(error, "this is error");
    res.status(400).json({ status: "fail", message: error.message });
  }
};

// login end

// update start

exports.updateUser = async (req, res) => {
  // console.log(req.headers.email)
  try {
    let email = req.headers.email;
    let data = req.body;
    console.log(email, data);
    let query = { email: email };
    const user = await UserModel.updateOne(query, data);
    res.status(200).json({ status: "success", data: user });
  } catch (error) {
    console.log(error, "this is error");
    res.status(500).json({ status: "fail", message: error.message });
  }
};

// read
exports.getAllUsers = async (req, res) => {
  try {
    const query = {};
    const result = await UserModel.find(query);
    res.status(200).json({ status: "success", data: result });
  } catch (error) {
    res.status(400).json({ status: "fail", message: error.message });
  }
};
// projection syntax
// exports.getAllUsers = async (req, res) => {
//   try {
//     const query = {};
//     const projection = {username: 1, email: 1, _id: 0};
//     const result = await UserModel.find(query, projection);
//     res.status(200).json({ status: "success", data: result });
//   } catch (error) {
//     res.status(400).json({ status: "fail", message: error.message });
//   }
// };

// update
// exports.updateUser = async (req, res) => {
//     const id = req.params.id;
//     const updatedata = req.body;
//     const query = {_id: id};
//     try{
//         const result = await UserModel.findByIdAndUpdate(query, updatedata);
//         res.status(200).json({status: "success", data: result})

//     }
//     catch(error){
//         res.status(400).json({status: "fail", message: error.message});

//     }
// }

// delete user
exports.deleteUser = async (req, res) => {
  const id = req.params.id;
  const query = { _id: id };
  try {
    const result = await UserModel.deleteOne(query);
    res.status(200).json({ status: "success", data: result });
  } catch (error) {
    res.status(400).json({ status: "fail", message: error.message });
  }
};
