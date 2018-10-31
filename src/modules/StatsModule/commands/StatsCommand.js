const Command = require("../../CommandModule/Command")
const {Inject} = require("injection-js")
const StatsDatabase = require("../databases/StatsDatabase")
const {not,oneOf,sComp} = require("../../../core/queryOperators")
const discord = require("discord.js")
const datefns = require("date-fns")

module.exports = class StatsCommand extends Command {

    static get commandName(){
        return "stats"
    }

    static get parameters(){
        return [new Inject(StatsDatabase)]
    }

    async execute(commandMessage){
        let guild = commandMessage.originalMessage.guild
        let user = commandMessage.originalMessage.author
        let member = guild.members.get(user.id)
        let db = this.statsDatabase.get(guild.id)

        let resultEmbed = new discord.RichEmbed()
        resultEmbed.setTitle(`Statistiques de ${member.nickname || user.username}`)

        let weekStart = datefns.startOfWeek(new Date())

        let messageData = 
            db.query`user:${user.id}:message:${sComp(not(oneOf("channel","total")))}`.map((key) => {
                let splitted = key.split(":")
                let date = new Date(parseInt(splitted[splitted.length-1]))
                
                return {
                    date,
                    value: db.get(key)
                }
            })

        let weekMessages = messageData.reduce((total,el) => {
            if(el.date.getTime() >= weekStart.getTime()){
                return total+el.value
            }
            return total
        },0)

        console.log(messageData)
        console.log(weekMessages)
    }

}