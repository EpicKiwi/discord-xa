const Middleware = require("../lib/Middleware")
const logger = require("../../logger")
const db = require("../../Database")
const settings = require("../../settings")
const Item = require("./Item")

class OctoberMiddleware extends Middleware {

    constructor(){
        super()
        this.tickRate = 1000

        this.inventorydb = db.createCollection("OctoberMiddleware","inventory")
        this.monstersdb = db.createCollection("OctoberMiddleware","monsters")

        this.items = settings.items.map((el) => Item.fromJson(el))
    }

    async init(){
        setTimeout(() => this.applyTick(), this.tickRate)
    }

    async applyTick(){
        await this.tick()
        setTimeout(() => this.applyTick(), this.tickRate)
    }

    async tick(){
    }

}

module.exports = new OctoberMiddleware()