const Action = require("./Action")

class MessageAction extends Action {

    constructor(discordMessage){
        super("message")
        this.message = discordMessage
    }

}

module.exports = MessageAction