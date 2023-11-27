const { Friend } = require("../models/models");

class FriendController {
    async getAllProject(req, res) {
        const {id_project} = req.query;

        const comments = await Comment.findAll({
            where: {
                projectId: id_project
            }
        })
    }
}

module.exports = new FriendController()