const Module = require("../../core/Module")
const discord = require("discord.js")
const {Inject} = require("injection-js")
const settings = require("../../../settings")
const MessageInputStream = require("./MessageInputStream")
const Logger = require("../../core/Logger")

class CoreModule extends Module {

    static get moduleName(){return "Core module"}

    static get description(){return "The main module of the Bot sending all messages on streams"}

    static get provides(){
        return [discord.Client]
    }
    
    static get parameters(){
        return [new Inject(discord.Client), new Inject(MessageInputStream)]
    }

    async init(){
        Logger.info("Logging in to discord")
        await this.client.login(settings.token)
        Logger.info("Logged in")
        this.client.on("message",this.onMessage.bind(this))
    }

    onMessage(message){
        this.messageInputStream.send(message)
    }

}

module.exports = CoreModule