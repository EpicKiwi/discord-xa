const Action = require("./Action")

class ReactionRemoveAction extends Action {

    constructor(discordReaction){
        super("reactionRemoved")
        this.reaction = discordReaction
    }

}

module.exports = ReactionRemoveAction