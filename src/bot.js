const Discord = require("discord.js")
const settings = require("./settings")
const logger = require("./logger")
const register = require("./register")
const MessageAction = require("./model/actions/MessageAction")
const ReactionAddAction = require("./model/actions/ReactionAddAction")
const ReactionRemoveAction = require("./model/actions/ReactionRemoveAction")

class XaBot {

	constructor(){

	    this.ready = false

        this.token = settings["discord-token"]
        this.startRegex = new RegExp(`^${settings["command-start"]}(.*)`)
        if(!this.token || this.token === ""){
            throw new Error("You need to specify a discord token")
        }
        this.client = new Discord.Client();
        this.client.on('message', (message) => this.onMessage(message))
        this.client.on('messageReactionAdd', (reaction) => this.onReactionAdded(reaction))
        this.client.on('messageReactionRemove', (reaction) => this.onReactionRemoved(reaction))
	}

    onMessage(message){
	    let action = new MessageAction(message)
        return this.executeAction(action)
    }

    onReactionAdded(reaction){
        let action = new ReactionAddAction(reaction)
        return this.executeAction(action)
    }

    onReactionRemoved(reaction){
        let action = new ReactionRemoveAction(reaction)
        return this.executeAction(action)
    }

    async executeAction(action){
        for(let middleware of register.middlewares){
            switch(action.type){
                case "message":
                    await middleware.onMessage(action)
                    break;
                case "reactionAdded":
                    await middleware.onReactionAdded(action)
                    break;
                case "reactionRemoved":
                    await middleware.onReactionRemoved(action)
                    break;
            }
        }
    }

    async login(){
        try {
            await this.client.login(this.token)
            await this.initMiddlewares()
            await this.client.user.setPresence(
                { game: null, status: 'online' })

            this.client.guilds.keyArray().forEach((key) => {
                logger.info(`Present in (${key}) ${this.client.guilds.get(key).name}`)
            })

            this.ready = true
        } catch(err){
            logger.error("Unable to start discord Bot")
            logger.error(err.message)
            console.trace(err)
            process.exit(1)
        }
    }

    async initMiddlewares(){
        for(let middleware of register.middlewares){
            await middleware.init()
        }
    }

}

module.exports = new XaBot()