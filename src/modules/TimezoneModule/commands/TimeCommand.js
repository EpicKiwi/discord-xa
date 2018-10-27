const Command = require("../../CommandModule/Command")
const MessageOutputStream = require("../../CoreModule/MessageOutputStream")
const {Inject} = require("injection-js")
const datefns = require("date-fns")
const dateFr = require("date-fns/locale/fr")
const {formatToTimeZone} = require("date-fns-timezone")

module.exports = class TimeCommand extends Command {

    static get commandName(){ return "time" }

    static get parameters(){
        return [
            new Inject(MessageOutputStream)
        ]
    }

    execute(commandMessage){

        let date = new Date()
        let timeZone = "Europe/Paris"

        let response = formatToTimeZone(date,"D MMMM YYYY **HH:mm**", {
            locale:dateFr, 
            timeZone})

        response += ` (${timeZone})`
        
        this.messageOutputStream.send(commandMessage.originalMessage.channel,
            response)

    }

}