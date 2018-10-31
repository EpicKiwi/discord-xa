const Module = require("../../core/Module")
const discord = require("discord.js")
const {Inject} = require("injection-js")
const settings = require("../../../settings")
const MessageInputStream = require("./MessageInputStream")
const MessageOutputStream = require("./MessageOutputStream")
const ReactionOutputStream = require("./ReactionOutputStream")
const Logger = require("../../core/Logger")

const TICK_SIZE = 500;
const NUMER_EQUIVALENT = {
    '0':'0⃣',
    '1':'1⃣',
    '2':'2⃣',
    '3':'3⃣',
    '4':'4⃣',
    '5':'5⃣',
    '6':'6⃣',
    '7':'7⃣',
    '8':'8⃣',
    '9':'9⃣',
    '10':'🔟'
}

class CoreModule extends Module {

    static get moduleName(){return "Core module"}

    static get description(){return "The main module of the Bot sending all messages on streams"}

    static get provides(){
        return [discord.Client,MessageInputStream,MessageOutputStream,ReactionOutputStream]
    }
    
    static get parameters(){
        return [new Inject(discord.Client), new Inject(MessageInputStream), new Inject(MessageOutputStream), new Inject(ReactionOutputStream)]
    }

    constructor(...args){
        super(...args)
        this.autoDestroyMessage = []
    }

    async init(){
        Logger.info("Logging in to discord")
        await this.client.login(settings.token)
        Logger.info("Logged in")
        this.client.on("message",this.onMessage.bind(this))
        this.messageOutputStream.subscribe(this.sendMessage.bind(this))
        this.reactionOutputStream.subscribe(this.reactMessage.bind(this))
        this.tick()
    }

    tick(){

        this.autoDestroyMessage = this.autoDestroyMessage.reduce((remainingMessage,message) => {

            let lastVal = message.autoDestroy
            let newVal = message.autoDestroy-TICK_SIZE
            message.autoDestroy = newVal

            if(Math.floor(lastVal/1000) > Math.floor(newVal/1000) && Math.floor(newVal/1000) < 11){
                let emoji = NUMER_EQUIVALENT[Math.floor(newVal/1000).toString()]
                this.reactionOutputStream.send(message.message,emoji)
            }

            if(newVal <= 0){
                message.message.delete()
                Logger.log(`Destroyed message ${message.message.id}`)
                return remainingMessage
            }

            return [...remainingMessage,message]
        },[])

        setTimeout(() => this.tick(),TICK_SIZE)
    }

    onMessage(message){
        this.messageInputStream.send(message)
    }

    async sendMessage(messageOutput){
        let message = await messageOutput.channel.send(messageOutput.content,messageOutput.attachment)
        messageOutput.markAsSent(message)
        if(messageOutput.autoDestroy){
            this.autoDestroyMessage.push(messageOutput)
        }
    }

    reactMessage(reactionOutput){
        reactionOutput.message.react(reactionOutput.emoji)
    }

}

module.exports = CoreModule