const Middleware = require("./lib/Middleware")
const logger = require("../logger")

class PinMiddleware extends Middleware {

    constructor(){
        super()
        this.name = "Pinning middleware"
        this.name = "Pin the messages with the 📍📍:pushpin: emoji📍"

        this.pins = ['📌','📍']
    }

    async onReactionAdded(action){
        if(this.pins.indexOf(action.reaction._emoji.name) == -1
            && !action.reaction.message.pinned)
            return

        try {
            await action.reaction.message.pin()
        } catch(e) {
            logger.error(`Can't pin message : ${e.message}`)
        }
        logger.info(`Pinned message ${action.reaction.message.content}`)
    }

    async onReactionRemoved(action){
        if(this.pins.indexOf(action.reaction._emoji.name) == -1)
            return

        if(Array.from(action.reaction.message.reactions.keys())
            .find((el) => this.pins.indexOf(el) != -1))
            return

        try {
            await action.reaction.message.unpin()
        } catch(e) {
            logger.error(`Can't pin message : ${e.message}`)
        }
        logger.info(`Un-pinned message ${action.reaction.message.content}`)
    }

}

module.exports = PinMiddleware