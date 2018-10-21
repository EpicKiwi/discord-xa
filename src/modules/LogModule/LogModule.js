const Module = require("../../core/Module")
const MessageInputStream = require("../CoreModule/MessageInputStream")
const {Inject} = require("injection-js")
const Logger = require("../../core/Logger")

class LogModule extends Module {

    static get moduleName(){
        return "Log module"
    }

    static get description(){
        return "A simple module logging in the console the massages seen by the bot"
    }

    static get parameters(){
        return [new Inject(MessageInputStream)]
    }

    async init(){
        this.messageInputStream
            .subscribe((message) => Logger.log(`New message : ${message.content}`))
    }

}

module.exports = LogModule