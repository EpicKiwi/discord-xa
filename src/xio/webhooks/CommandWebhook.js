const logger = require("../../logger")
const request = require("request")
const Webhook = require("./Webhook")
const map = require("../map")
const WebhookCommand = require("./WebhookCommand")

module.exports = class CommandWebhook extends Webhook {

    constructor(app,channels,callback,name,categories,doc,categoryDefault){
        super(app,channels,callback)
        this.type = "command"
        this.categories = categories
        this.command = new WebhookCommand(name,this,doc,categoryDefault)
    }

    call(message,args,callback){
        let body = {
            message: map.fullMessage(message),
            guild: map.smallGuild(message.guild),
            channel: map.smallChannel(message.channel),
            command: map.fullCommand(this.command),
            args: args
        }
        super.call(body,callback)
    }

    register(){

    }

    unregister(){

    }

}