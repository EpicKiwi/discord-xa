const Command = require("./Command")

class PingCommand extends Command {

    static getName(){return "Ping"}
    static getDescription(){return "Renvoie simplement pong"}
    static getCommandName(){return "ping"}

    constructor(contentOrCommand,action,middleware){
        super(contentOrCommand,action,middleware)

        this.defineCollection("pingNames")
    }

    async execute(){
        let pongName = "Pong"
        let pingCollection = this.getCollection("pingNames")

        if(this.action.message.guild) {
            let pongDoc = await pingCollection.findOne({server: this.action.message.guild.id})

            if(!pongDoc){
                await pingCollection.insert({server: this.action.message.guild.id,pongName})
            } else {
                pongName = pongDoc.pongName
            }
        }

        if(this.args.length >= 2 && this.args[0] == "define"){
            pongName = this.args.slice(1).join(" ")
            await pingCollection.update({server: this.action.message.guild.id},{
                $set: {
                    pongName
                }
            })
            await this.action.reply(`New pong interaction defined as ${pongName}`)
            return
        }

        if(this.args.length > 0){
            await this.action.reply(`${pongName} ${this.args.join(" ")}`)
        } else {
            await this.action.reply(pongName)
        }
    }

}

module.exports = PingCommand