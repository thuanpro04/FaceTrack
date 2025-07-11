const express = require("express");
const { getManageInfo } = require("../controllers/userController");
const userRouter = express();
userRouter.get('/manage/:id',getManageInfo)
module.exports = userRouter;
