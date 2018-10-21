const Stream = require("../../core/Stream")
const discord = require("discord.js")

/**
 * Streams of all the messages seen by the Bot
 */
class MessageInputStream extends Stream {

    static messageClass(){
        return discord.Message
    }

    send(message){
        this.next(message)
    }

}

module.exports = MessageInputStream