const Action = require("./Action")

class ReactionAddAction extends Action {

    constructor(discordReaction){
        super("reactionAdded")
        this.reaction = discordReaction
    }

}

module.exports = ReactionAddAction