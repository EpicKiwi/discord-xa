const Command = require("../../CommandModule/Command")
const {Inject} = require("injection-js")
const MessageOutputStream = require("../../CoreModule/MessageOutputStream")
const settings = require("../../../../settings")
const HttpServer = require("../HttpServer")

module.exports = class GetAuthKeyCommand extends Command {

    static get commandName(){
        return 'getAuthKey'
    }

    static get parameters(){
        return [
            new Inject(MessageOutputStream),
            new Inject(HttpServer)
        ]
    }

    async execute(commandMessage){ 
        let {channel,guild,author} = commandMessage.originalMessage

        let key = await this.httpServer.getAuthKey(guild.id,author.id,"xa-com",{
            mss: commandMessage.originalMessage.id
        })
        
        this.messageOutputStream.send(channel,
            `Clé d'authentification pour ${guild.name} \`\`\`${key}\`\`\``,
            {autoDestroy:settings.http.jwt.lifetime})
    }

}