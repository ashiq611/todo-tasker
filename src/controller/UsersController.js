// user create

const UserModel = require("../models/usersModel");
const otpModel = require("../models/otpModel");
const jwt = require("jsonwebtoken");
const sendEmail = require("../utils/SendEmailUtility");

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
        exp: Math.floor(Date.now() / 1000) + 60 * 60,
        data: user["email"],
      };

      const token = jwt.sign(payload, "123456789");

      // projection
      const responseData = {
        _id: user["_id"],
        firstName: user["firstName"],
        lastName: user["lastName"],
        email: user["email"],
        profilePicture: user["profilePicture"],
      };

      res
        .status(200)
        .json({ status: "success", data: responseData, token: token });
    }
  } catch (error) {
    console.log(error, "this is error");
    res.status(400).json({ status: "fail", message: error.message });
  }
};

// login end

// details profile
exports.ProfileDetails = async (req, res) => {
  try {
    const email = req.headers.email;
    const query = { email: email };
    const result = await UserModel.findOne(query);
    res.status(200).json({ status: "success", data: result });
  } catch (error) {
    res.status(400).json({ status: "fail", message: error.message });
  }
};

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

// email verify
exports.emailVerify = async (req, res) => {
  try {
    const email = req.params.email;
    const query = { email: email };
    let otp = Math.floor(1000 + Math.random() * 9000); // 4 digit
    const user = await UserModel.find(query);
    if (!user) {
      console.log(user);
      res.status(400).json({ status: "fail", message: "user not found" });
    } else {
      // step-1
      let createOtp = await otpModel.create({
        email: email,
        otp: otp,
      });
      // step-2
      let sendEmails = await sendEmail(
        email,
        "ToDo Tasker Password Reset",
        `Your OTP is ${otp}`
      );
      res.status(200).json({ status: "success", data: "otp send" });
    }
  } catch (error) {
    console.log(error, "this is error");
  }
};

// otp verify
exports.otpVerify = async (req, res) => {
  try {
    const email = req.params.email;
    const otp = req.params.otp;
    let status = 0;
    let updateStatus = 1;
    let otpcheck = await otpModel.aggregate([
      { $match: { email: email, otp: otp } },
      { $count: "total" },
    ]);
    if (otpcheck.length > 0) {
      let updateOtp = await otpModel.updateOne(
        {
          email: email,
          otp: otp,
          status: status,
        },
        {
          email: email,
          otp: otp,
          status: updateStatus,
        }
      );

      res.status(200).json({ status: "success", data: "otp verified" });
    } else {
      res.status(400).json({ status: "fail", message: "invalid otp" });
    }
  } catch (error) {
    res.status(400).json({ status: "fail", message: error.message });
  }
};

// reset password
exports.resetPassword = async (req, res) => {
  try {
    const email = req.body.email;
    const otp = req.body.otp;
    const updatePassword = req.body.password;
    const updateStatus = 1;

    let otpcheck = await otpModel.aggregate([
      { $match: { email: email, otp: otp, status: updateStatus } },
      { $count: "total" },
    ]);

    if (otpcheck.length > 0) {
      let passwordUpdate = await UserModel.updateOne(
        {
          email: email,
        },
        {
          password: updatePassword,
        }
      );
      res.status(200).json({ status: "success", data: passwordUpdate });
    }
  } catch (error) {
    res.status(400).json({ status: "fail", message: error.message });
  }
};
