const Middleware = require("../lib/Middleware")
const Command = require("./commands/Command")
const settings = require("../../settings")
const logger = require("../../logger")
const commandRegister = require("./commandRegister")

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
        let content = match[1]

        for(let commandClass of commandRegister.commands){
            let commandMatch = content.match(commandClass.getCommandNameRegex())
            if(commandMatch){
                action.command = new commandClass(content,action,this)
                logger.info(`Command ${action.command.constructor.getName()} : ${action.command.content}`)
                await action.command.execute()
                return
            }
        }

        logger.info(`Command ${content} not found`)
    }

}

module.exports = CommandMiddleware