const Command = require("../Command");
const {Inject} = require("injection-js")
const MessageOutputStream = require("../../CoreModule/MessageOutputStream")

module.exports = class PingCommand extends Command {

    static get commandName(){
        return 'ping'
    }

    static get parameters(){
        return [new Inject(MessageOutputStream)]
    }

    execute(commandMessage){
        console.log(commandMessage.args)
        this.messageOutputStream.send(
            commandMessage.originalMessage.channel,
            "Pong")
    }

}