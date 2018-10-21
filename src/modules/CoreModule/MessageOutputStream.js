const Stream = require("../../core/Stream")
const discord = require("discord.js")

    /**
     * A message to send to the server
     * @param {discord.Channel} channel 
     * @param {string} messageContent 
     */
class MessageOutput {
    constructor(channel,content){
        this.channel = channel;
        this.content = content
    }
}

/**
 * Free writable stream, each message on this stream will be sent by the bot
 */
class MessageOutputStream extends Stream {

    static messageClass(){
        return MessageOutput
    }

    /**
     * Send a message to the specified channel
     * @param {discord.Channel} channel 
     * @param {string} message 
     */
    send(channel,message){
        this.next(new MessageOutput(channel,message))
    }

}

module.exports = MessageOutputStream