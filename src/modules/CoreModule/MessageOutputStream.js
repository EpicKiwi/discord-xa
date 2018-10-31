const Stream = require("../../core/Stream")
const discord = require("discord.js")

    /**
     * A message to send to the server
     * @param {discord.Channel} channel 
     * @param {string} messageContent 
     */
class MessageOutput {
    constructor(channel,content,options){
        this.channel = channel;
        this.content = content;
        this.sent = false;
        
        if(options){
            this.autoDestroy = options.autoDestroy;
            this.attachment = options.attachment;
        }
    }

    markAsSent(sentMessage){
        this.message = sentMessage
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
     * @param {{autoDestroy:number,attachment:*}} options
     */
    send(channel,message,options){
        this.next(new MessageOutput(channel,message,options))
    }

}

module.exports = MessageOutputStream