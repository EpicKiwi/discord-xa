const logger = require('../../../logger')
const Database = require("../../../Database")

class Command {

    static getName(){return "Unamed command"}
    static getDescription(){return ""}
    static getCommandName(){return ""}
    static getCommandNameRegex(){return new RegExp(`^ *${this.getCommandName()} *(.*)$`,"i")}

    constructor(content, action, middleware){
        this.content = content
        this.action = action
        this.middleware = middleware

        let rawArgs = this.content.match(this.constructor.getCommandNameRegex())
        this.args = rawArgs[1].split(" ")
        if(this.args.length == 1 && this.args[0] == "")
            this.args = []
    }

    defineCollection(name){
        Database.createCollection(this.constructor.getName()+"command",name)
    }

    getCollection(name){
        return Database.collections[this.constructor.getName()+"command"][name]
    }

    async execute(){}

}

module.exports = Command