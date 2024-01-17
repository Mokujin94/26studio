const Router = require("express");
const router = new Router();

const UserRouter = require("./userRouter");
const ProjectRouter = require("./projectRouter");
const NewsRouter = require("./newsRouter");
const GroupRouter = require("./groupRouter");
const MessageRouter = require("./messageRouter");
const RolesRouter = require("./rolesRouter");
const FriendRouter = require("./friendRouter");
const CommentRouter = require("./commentRouter");
const ViewRouter = require("./viewRouter");
const SearchRouter = require("./searchRouter");

router.use("/user", UserRouter);
router.use("/project", ProjectRouter);
router.use("/news", NewsRouter);
router.use("/message", MessageRouter);
router.use("/group", GroupRouter);
router.use("/roles", RolesRouter);
router.use("/friend", FriendRouter);
router.use("/comment", CommentRouter);
router.use("/view", ViewRouter);
router.use("/search", SearchRouter);

module.exports = router;
