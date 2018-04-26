const Discord = require("discord.js")
const settings = require("./settings")
const logger = require("./logger")
const register = require("./register")
const MessageAction = require("./model/actions/MessageAction")

class XaBot {

	constructor(){
        this.token = settings["discord-token"]
        this.startRegex = new RegExp(`^${settings["command-start"]}(.*)`)
        if(!this.token || this.token === ""){
            throw new Error("You need to specify a discord token")
        }
        this.client = new Discord.Client();
        this.client.on('message', (message) => {
            this.onMessage(message)
        })
	}

    onMessage(message){
	    let action = new MessageAction(message)
        this.executeAction(action)
    }

    async executeAction(action){
        for(let middleware of register.middlewares){
            await middleware.onAction(action)
        }
    }

    async login(){
        try {
            await this.client.login(this.token)
        } catch(err){
            logger.error("Unable to start discord Bot")
            logger.error(err.message)
            process.exit(1)
        }
    }

}

module.exports = new XaBot()