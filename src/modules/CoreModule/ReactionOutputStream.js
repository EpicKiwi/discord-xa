const Stream = require("../../core/Stream")

class ReactionOutput {
    constructor(message,reactionEmoji){
        this.message = message;
        this.emoji = reactionEmoji
    }
}

class ReactionOutputStream extends Stream {

    static messageClass(){
        return ReactionOutput
    }

    send(message,reactionEmoji){
        this.next(new ReactionOutput(message,reactionEmoji))
    }

}

module.exports = ReactionOutputStream