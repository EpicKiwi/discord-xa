const logger = require("../../logger")
const request = require("request")
const Webhook = require("./Webhook")
const map = require("../map")

module.exports = class MessageWebhook extends Webhook {

    constructor(app,channels,callback){
        super(app,channels,callback)
        this.type = "message"
    }

    call(message,callback){
        let body = {
            message: map.fullMessage(message),
            guild: map.smallGuild(message.guild),
            channel: map.smallChannel(message.channel)
        }
        super.call(body,callback)
    }

}