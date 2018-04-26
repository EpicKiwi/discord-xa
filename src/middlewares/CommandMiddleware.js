const Middleware = require("./lib/Middleware")
const Command = require("../model/Command")
const settings = require("../settings")
const logger = require("../logger")

class CommandMiddleware extends Middleware {

    constructor(){
        super()
        this.commandRegex = new RegExp(`^ *${settings["command-start"]} *(.*) *$`,"i")
    }

    async onAction(action){
        if(action.type != "message") return

        let match = action.message.content.match(this.commandRegex)
        if(!match) return

        action.isCommand = true
        action.command = new Command(match[1])

        logger.info(`Command : ${action.command.content}`)
    }

}

module.exports = CommandMiddleware