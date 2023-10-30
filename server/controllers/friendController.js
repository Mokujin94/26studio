const { Friend } = require("../models/models");

class FriendController {
    async getAll(req, res) {
        const {userId} = req.query;
        
        const friend = await Friend.findAll({
            where: {
                userId
            }
        })

        return res.json(friend);
    }

    async addFriend(req, res) {
        const {id, id_recipient} = req.body;

        const friend = await Friend.create({id_sender: id, id_recipient, userId: id});

        return res.json(friend);
    }

    // async deleteFriend(req, res) {
    //     const {id, id_recipient} = req.body;

    //     const friend = await Friend.({id_sender: id, id_recipient, userId: id});

    //     return res.json(friend);
    // }
}

module.exports = new FriendController()