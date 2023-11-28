const { Comments, Project, News } = require("../models/models");
const { getIo } = require("../socket");

class CommentController {
  async getAllCommentsProject(req, res) {
    const { id } = req.params;

    const comments = await Project.findAll({
      include: Comments,
      where: {
        id,
      },
    });

    return res.json(comments);
  }

  async getAllCommentsNews(req, res) {
    const comments = await News.findAll({
      include: Comments,
    });

    return res.json(comments);
  }

  async createCommentProject(req, res) {
    const { message, projectId, resendId } = req.body;

    const comment = await Comments.create({
      message,
      projectId,
      resendId,
    });
    const io = getIo();
    io.emit("sendCommentsToClients", comment);
    return res.json(comment);
  }

  async createCommentNews(req, res) {
    const { message, newsId, resendId } = req.body;

    const comment = await Comments.create({
      message,
      newsId,
      resendId,
    });

    return res.json(comment);
  }
}

module.exports = new CommentController();
