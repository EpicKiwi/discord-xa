const Command = require("../../CommandModule/Command")
const MessageOutputStream = require("../../CoreModule/MessageOutputStream")
const {Inject} = require("injection-js")
const datefns = require("date-fns")
const dateFr = require("date-fns/locale/fr")
const {formatToTimeZone} = require("date-fns-timezone")
const TimezoneDatabase = require("../databases/TimezoneDatabase")

module.exports = class TimeCommand extends Command {

    static get commandName(){ return "time" }

    static get parameters(){
        return [
            new Inject(MessageOutputStream),
            new Inject(TimezoneDatabase)
        ]
    }

    execute(commandMessage){
        let serverDb = this.timezoneDatabase.get(commandMessage.originalMessage.guild.id)
        let user = commandMessage.originalMessage.author
        let channel = commandMessage.originalMessage.channel

        let date = new Date()
        let timeZone = serverDb.get(`user:${user.id}`)

        let selectedUser = commandMessage.args.find((el) => el.type == "user")
        let selectedChannel = commandMessage.args.find((el) => el.type == "channel")

        if(selectedUser) {
            timeZone = serverDb.get(`user:${selectedUser.mentioned.id}`)
        }

        if(!timeZone || 
            commandMessage.hasNamed("channel") || 
            commandMessage.hasSwitch("c") || 
            selectedChannel){

            if(selectedChannel){
                timeZone = serverDb.get(`channel:${selectedChannel.mentioned.id}`)
            } else {
                timeZone = serverDb.get(`channel:${channel.id}`)
            }

        }

        if(!timeZone 
            || commandMessage.hasNamed("server") 
            || commandMessage.hasSwitch("s")){

            timeZone = serverDb.get(`server`)
            
        }

        let response = formatToTimeZone(date,"D MMMM YYYY **HH:mm**", {
            locale:dateFr, 
            timeZone})

        response += ` (${timeZone})`
        
        this.messageOutputStream.send(commandMessage.originalMessage.channel,
            response)

    }

}