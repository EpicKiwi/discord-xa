const Middleware = require("../lib/Middleware")
const Command = require("./commands/Command")
const settings = require("../../settings")
const logger = require("../../logger")
const commandRegister = require("./commandRegister")

class CommandMiddleware extends Middleware {

    constructor(){
        super()
        this.commandRegex = new RegExp(`^ *${settings["command-start"]} *(.*) *$`,"im")
        this.name = "Command middleware"
        this.description = `Execute a commande after the "${settings["command-start"]}" symbol`
    }

    async onMessage(action){
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
                try {
                    await action.command.execute()
                } catch(e) {
                    action.reply("**Erreur fatale** interne durant l'execution de la commande")
                    throw e
                }
                return
            }
        }

        logger.info(`Command ${content} not found`)
    }

}

module.exports = CommandMiddleware