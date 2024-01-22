const { Friend, Subscriber, User } = require("../models/models");

class FriendController {
    async getAllSubscriber(req, res) {
        const {userId} = req.query;
        
        const friend = await Subscriber.findAll({
            include: [User],
            where: {
                userId
            }
        })

        return res.json(friend);
    }

    async getAllFriends(req, res) {
        const {userId} = req.query;
        
        const friend = await Friend.findAll({
            include: [User],
            where: {
                [Op.or]: [{ id_recipient: userId, userId: userId }],
            }
        })

        return res.json(friend);
    }

    async addSubscriber(req, res) {
        const {id, id_recipient} = req.body;

        const friend = await Subscriber.create({id_sender: id, id_recipient, userId: id});

        return res.json(friend);
    }

    async addFriend(req, res) {
        const {id, id_recipient} = req.body;

        const friend = await Friend.create({id_sender: id, id_recipient, userId: id});

        return res.json(friend);
    }

    async deleteSubscriber(req, res) {
        const {id, id_recipient} = req.query;

        const friend = await Subscriber.destroy({
            where: {id, id_recipient}
        });

        return res.json(friend);
    }

    async deleteFriend(req, res) {
        const {id, id_recipient} = req.query;

        const friend = await Friend.destroy({
            where: {id, id_recipient}
        });

        return res.json(friend);
    }
}

module.exports = new FriendController()