const Command = require("../../CommandModule/Command")
const {Inject} = require("injection-js")
const StatsDatabase = require("../databases/StatsDatabase")
const {not,oneOf,sComp, any} = require("../../../core/queryOperators")
const discord = require("discord.js")
const datefns = require("date-fns")
const StatsHelper = require("../../StatsModule/StatsHelper")
const MessageOutputStream = require("../../CoreModule/MessageOutputStream")

module.exports = class StatsCommand extends Command {

    static get commandName(){
        return "stats"
    }

    static get parameters(){
        return [new Inject(StatsDatabase), new Inject(StatsHelper), new Inject(MessageOutputStream)]
    }

    async execute(commandMessage){
        let {cropTimeline,totalTimeline,getValueIndex, parseTimeline, filterBy, onFiltered} = this.statsHelper

        let guild = commandMessage.originalMessage.guild
        let user = commandMessage.originalMessage.author
        let channel = commandMessage.originalMessage.channel
        let member = guild.members.get(user.id)
        let db = this.statsDatabase.get(guild.id)

        let toDate = new Date()
        let fromDate = datefns.subDays(toDate)

        let messagesGreatTotal = getValueIndex(
            db.query`user:${user.id}:message:total`,0)

        let messagesTimeline = db.query`user:${user.id}:message:${not(oneOf("channel","total"))}`
        messagesTimeline = parseTimeline(messagesTimeline)
        messagesTimeline = cropTimeline(messagesTimeline,fromDate,toDate)
        let messagesTotal = totalTimeline(messagesTimeline)
        
        let messagesChannels = db.query`user:${user.id}:message:channel:${sComp(any())}:${not(oneOf('total'))}`
        messagesChannels = filterBy(messagesChannels,/channel:([^:]+)/)
        messagesChannels = onFiltered(messagesChannels,parseTimeline)
        messagesChannels = onFiltered(messagesChannels,(el) => cropTimeline(el,fromDate,toDate))
        messagesChannels = onFiltered(messagesChannels,totalTimeline)
        messagesChannels = Object.keys(messagesChannels).reduce((acc,channelId) => {
            let total = messagesChannels[channelId]
            let res = {
                channel: guild.channels.get(channelId),
                total
            }
            return [...acc,res]
        },[]).sort((a,b) => b.total-a.total)
        messagesChannels = messagesChannels.reduce((str,stat,i) => {
            if(i < 5){
                return `${str}#${stat.channel.name} : ${stat.total}\n`
            }
        },"")

        let embed = new discord.RichEmbed()
        embed.setTitle(`Statistiques de ${member.nickname || user.username}`)
        embed.setDescription("Messages sur les 7 derniers jours")
        embed.setColor([114,137,218])
        embed.addField("Depuis le début", `${messagesGreatTotal} messages`, true)
        embed.addField("Les 7 derniers jours", `${messagesTotal} messages`, true)
        embed.addBlankField(true)
        embed.addField("Messages par channel", messagesChannels, true)
        this.messageOutputStream.send(channel,embed)
    }

}