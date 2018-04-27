const logger = require('../../../logger')

class Command {

    static getName(){return "Unamed command"}
    static getDescription(){return ""}
    static getCommandName(){return ""}
    static getCommandNameRegex(){return new RegExp(`^ *${this.getCommandName()} *(.*)$`,"i")}

    constructor(content, action){
        this.content = content
        this.action = action

        let rawArgs = this.content.match(this.constructor.getCommandNameRegex())
        this.args = rawArgs[1].split(" ")
        if(this.args.length == 1 && this.args[0] == "")
            this.args = []
    }

    async execute(){}

}

module.exports = Command