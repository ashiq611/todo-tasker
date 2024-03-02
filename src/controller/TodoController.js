const todoModel = require("../models/todoModel");

// create todo
exports.createTodo = async (req, res) => {
  try {
    const data = req.body;
    data.email = req.headers.email;
    const todo = await todoModel.create(data);
    res.status(201).json({ status: "success", data: todo });
  } catch (error) {
    res.status(400).json({ status: "fail", message: error.message });
  }
};

// update todo
exports.updateTodo = async (req, res) => {
  const id = req.params.id;
  const status = req.params.status;
  const updatedata = req.body;
  const query = { _id: id };
  try {
    const result = await todoModel.updateOne(query, { status: status });
    res.status(200).json({ status: "success", data: result });
  } catch (error) {
    res.status(400).json({ status: "fail", message: error.message });
  }
};

// delete todo
exports.deleteTodo = async (req, res) => {
  const id = req.params.id;
  const query = { _id: id };
  try {
    const result = await todoModel.deleteOne(query);
    res.status(200).json({ status: "success", data: result });
  } catch (error) {
    res.status(400).json({ status: "fail", message: error.message });
  }
};

// todo list by status

exports.todoListByStatus = async (req, res) => {
  try {
    const email = req.headers.email;
    const status = req.params.status;
    const result = await todoModel.aggregate([
      {
        $match: {
          email: email,
          status: status,
        },
      },
      {
        $project: {
          _id: 1,
          title: 1,
          description: 1,
          status: 1,
          createdDate: {
            $dateToString: {
              date: "$createdDate",
              format: "%d-%m-%Y",
            },
          },
        },
      },
    ]);

    res.status(200).json({ status: "success", data: result });
  } catch (error) {
    res.status(400).json({ status: "fail", message: error.message });
  }
};

// todo count by status

exports.todoCountByStatus = async (req, res) => {
  try {
    const email = req.headers.email;
    const result = await todoModel.aggregate([
      {
        $match: {
          email: email,
        },
      },
      {
        $group: {
          _id: "$status",
          total: { $count: {} },
        },
      },
    ]);

    res.status(200).json({ status: "success", data: result });
  } catch (error) {
    res.status(400).json({ status: "fail", message: error.message });
  }
};
