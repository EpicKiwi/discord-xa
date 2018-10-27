const Module = require("../../core/Module")
const discord = require("discord.js")
const {Inject} = require("injection-js")
const settings = require("../../../settings")
const MessageInputStream = require("./MessageInputStream")
const MessageOutputStream = require("./MessageOutputStream")
const ReactionOutputStream = require("./ReactionOutputStream")
const Logger = require("../../core/Logger")

class CoreModule extends Module {

    static get moduleName(){return "Core module"}

    static get description(){return "The main module of the Bot sending all messages on streams"}

    static get provides(){
        return [discord.Client,MessageInputStream,MessageOutputStream,ReactionOutputStream]
    }
    
    static get parameters(){
        return [new Inject(discord.Client), new Inject(MessageInputStream), new Inject(MessageOutputStream), new Inject(ReactionOutputStream)]
    }

    async init(){
        Logger.info("Logging in to discord")
        await this.client.login(settings.token)
        Logger.info("Logged in")
        this.client.on("message",this.onMessage.bind(this))
        this.messageOutputStream.subscribe(this.sendMessage.bind(this))
        this.reactionOutputStream.subscribe(this.reactMessage.bind(this))
    }

    onMessage(message){
        this.messageInputStream.send(message)
    }

    sendMessage(messageOutput){
        messageOutput.channel.send(messageOutput.content)
    }

    reactMessage(reactionOutput){
        reactionOutput.message.react(reactionOutput.emoji)
    }

}

module.exports = CoreModule