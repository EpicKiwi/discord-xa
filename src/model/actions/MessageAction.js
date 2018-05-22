const Action = require("./Action")

class MessageAction extends Action {

    constructor(discordMessage){
        super("message")
        this.message = discordMessage
    }

    async reply(...args){
        await this.message.channel.send(...args)
    }

}

module.exports = MessageAction