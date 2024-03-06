const express = require("express");

const router = express.Router();

const TestController = require("../controller/TestController");

const UserController = require("../controller/UsersController");

const TodoController = require("../controller/TodoController");

const authVerifyMiddleware = require("../middleware/authVerifyMiddleware");

router.get("/test", TestController.test);

// user api start

// post user
router.post("/registration", UserController.registration);
// get login
router.get("/login", UserController.login);
// post update
router.post("/updateuser", authVerifyMiddleware, UserController.updateUser);
// get user
router.get("/getallusers", UserController.getAllUsers);
// update user
router.post("/updateuser/:id", UserController.updateUser);
// delete user
router.get("/deleteuser/:id", UserController.deleteUser);
// profile details
router.get(
  "/profiledetails",
  authVerifyMiddleware,
  UserController.ProfileDetails
);
// send otp
router.post("/email-verify/:email", UserController.emailVerify);
// otp verify
router.post("/otp-verify/:email/:otp", UserController.otpVerify);
// reset password
router.post("/reset-password", UserController.resetPassword);
// user api end

// todo api start

// create todo
router.post("/createtodo", authVerifyMiddleware, TodoController.createTodo);
// update todo
router.get(
  "/todo-update-status/:id/:status",
  authVerifyMiddleware,
  TodoController.updateTodo
);
// delete todo
router.get("/delete-todo/:id", authVerifyMiddleware, TodoController.deleteTodo);
// todo list by status
router.get(
  "/todo-list/:status",
  authVerifyMiddleware,
  TodoController.todoListByStatus
);
// todo count by status
router.get(
  "/todo-count",
  authVerifyMiddleware,
  TodoController.todoCountByStatus
);

module.exports = router;
