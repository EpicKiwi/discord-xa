const Command = require("../../CommandModule/Command")
const {Inject} = require("injection-js")
const MessageOutputStream = require("../../CoreModule/MessageOutputStream")
const settings = require("../../../../settings")
const jwt = require("jsonwebtoken")

module.exports = class GetAuthKeyCommand extends Command {

    static get commandName(){
        return 'getAuthKey'
    }

    static get parameters(){
        return [
            new Inject(MessageOutputStream)
        ]
    }

    execute(commandMessage){ return new Promise((resolve,reject) => {
        let {channel,guild,author} = commandMessage.originalMessage

        let payload = {
            gld: guild.id,
            usr: author.id,
            mss: commandMessage.originalMessage.id,
            iat: Math.round(Date.now()/1000),
            exp: Math.round((Date.now()+settings.http.jwt.lifetime)/1000),
            iss: "xa-com"
        }

        jwt.sign(payload,settings.http.jwt.secret,(err,key) => {
            if(err)
                return reject(err)
            
            this.messageOutputStream.send(channel,
                `Clé d'authentification pour ${guild.name} \`\`\`${key}\`\`\``)
            
            resolve()
        })
    })}

}