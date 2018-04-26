const Middleware = require("./lib/Middleware")
const logger = require("../logger")

class LogMiddleware extends Middleware {

    constructor(){
        super()
        this.name = "Logging middleware"
        this.name = "Log messages in the console"
    }

    async onAction(action){
        if(action.isCommand) return
        logger.info(`Message : ${action.message.content}`)
    }

}

module.exports = LogMiddleware