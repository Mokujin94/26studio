const {Project} = require('../models/models')
const uuid = require('uuid')
const path = require('path')
const ApiError = require('../error/ApiError')

class ProjectController {
    async create(req, res, next) {
        try {
            const {name, start_date, description, files} = req.body
            const {img} = req.files
            let fileName = uuid.v4() + ".jpg"
            img.mv(path.resolve(__dirname, '..', 'static/projects', fileName))
            const project = await Project.create({name, start_date, description, files, img: fileName})
            return res.json(project)
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async getAll(req, res) {
        let {limit, page} = req.query
        page = page || 1
        limit = limit || 9
        let offset = page * limit - limit

        let projects = await Project.findAndCountAll({limit, offset})
        return res.json(projects) 
    }

    async getOne(req, res) {
        const {id} = req.params
        const project = await Project.findOne(
            {
                where: {id}
            } 
        )
        return res.json(project)
    }
    
}

module.exports = new ProjectController()