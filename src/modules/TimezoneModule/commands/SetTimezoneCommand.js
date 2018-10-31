const Command = require("../../CommandModule/Command")
const MessageOutputStream = require("../../CoreModule/MessageOutputStream")
const {Inject} = require("injection-js")
const datefns = require("date-fns")
const dateFr = require("date-fns/locale/fr")
const {formatToTimeZone} = require("date-fns-timezone")
const TimezoneDatabase = require("../databases/TimezoneDatabase")
const {listTimeZones} = require("timezone-support")

module.exports = class setTimezoneCommand extends Command {

    static get commandName(){ return "setTz" }

    static get parameters(){
        return [
            new Inject(MessageOutputStream),
            new Inject(TimezoneDatabase)
        ]
    }

    execute(commandMessage){
        let serverDb = this.timezoneDatabase.get(commandMessage.originalMessage.guild.id)

        let param = commandMessage.args.find((el) => el.type == "literal");
        if(!param && !commandMessage.hasSwitch("d")){
            this.messageOutputStream.send(commandMessage.originalMessage.channel,
                "**Erreur** Veuillez renseigner un nom de TimeZone",
                {autoDestroy:8000})
            return 1;
        }

        let tz = null

        if(!commandMessage.hasSwitch("d")){
            tz = listTimeZones().find((el) => el.toLowerCase() == param.value.toLowerCase())
            if(!tz){
                this.messageOutputStream.send(commandMessage.originalMessage.channel,
                    `**Erreur** Aucune zone ne porte le nom ${param.value}`,
                    {autoDestroy:8000})
                return 2;
            }
        }

        if(
            commandMessage.hasNamed("server") || 
            commandMessage.hasSwitch("s")){

            serverDb.set("server",tz)
            this.messageOutputStream.send(commandMessage.originalMessage.channel,
                `TimeZone du serveur définie sur ${tz}`)

        } else if(
            commandMessage.hasNamed("channel") || 
            commandMessage.hasSwitch("c")){

            let channel = commandMessage.originalMessage.channel
            serverDb.set(`channel:${channel.id}`,tz)
            this.messageOutputStream.send(commandMessage.originalMessage.channel,
                `TimeZone de ${channel} définie sur ${tz}`) 

        } else {
            let user = commandMessage.originalMessage.author
            serverDb.set(`user:${user.id}`,tz)
            this.messageOutputStream.send(commandMessage.originalMessage.channel,
                `TimeZone de ${user} définie sur ${tz}`) 
        }

    }

}