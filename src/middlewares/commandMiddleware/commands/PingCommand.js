const Command = require("./Command")
const logger = require('../../../logger')

class PingCommand extends Command {

    static getName(){return "Ping"}
    static getDescription(){return "Renvoie simplement pong"}
    static getCommandName(){return "ping"}

    constructor(contentOrCommand,action){
        super(contentOrCommand,action)
    }

    async execute(){
        if(this.args.length > 0){
            await this.action.reply(`Pong ${this.args.join(" ")}`)
        } else {
            await this.action.reply("Pong")
        }
    }

}

module.exports = PingCommand