const Command = require("./Command")
const emo = require('emoticon-data')

class PingCommand extends Command {

    static getName(){return "Fun face"}
    static getDescription(){return "Renvoie un tête alétoire"}
    static getCommandName(){return "_<"}

    constructor(contentOrCommand,action,middleware){
        super(contentOrCommand,action,middleware)

        this.defineCollection("pingNames")
    }

    async execute(){
        let emoticon = emo.emoticons[Math.floor(Math.random()*emo.emoticons.length)]
        this.action.reply(emoticon.string)
    }

}

module.exports = PingCommand