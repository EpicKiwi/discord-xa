const Command = require("../Command");
const {Inject} = require("injection-js")
const MessageOutputStream = require("../../CoreModule/MessageOutputStream")

/**
 * Ping command that send "pong" on executing followed by all "textBased" parameters
 * 
 *  -q      Quiet      Don't say "pong"
 *
 */
module.exports = class PingCommand extends Command {

    static get commandName(){
        return 'ping'
    }

    static get parameters(){
        return [new Inject(MessageOutputStream)]
    }

    execute(commandMessage){

        let parameters = commandMessage.args
                .filter((el) => ["switch","named"].indexOf(el.type) == -1)
                .map((el) => el.value)
                .join(" ")

        let response = parameters

        if(!commandMessage.hasSwitch("q")){
            response = "pong " + response
        }

        this.messageOutputStream.send(
            commandMessage.originalMessage.channel,
            response)
    }

}