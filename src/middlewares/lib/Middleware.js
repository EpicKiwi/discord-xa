const Database = require("../../Database")

let nextMiddlewareId = 0;

module.exports = class Middleware {

    constructor(){
        this.id = nextMiddlewareId
        nextMiddlewareId++;

        this.name = `Unamed middleware #${this.id}`
        this.decription = `Please give a description to this Middleware`
    }

    defineCollection(name){
        Database.createCollection(this.constructor.getName())
    }

    async init(){}

    async onMessage(action){}

    async onReactionAdded(action){}

    async onReactionRemoved(action){}

}