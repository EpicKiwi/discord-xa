const Discord = require("discord.js")
const settings = require("./settings")
const logger = require("./logger")
const CommandError = require("./CommandError")
const CommandManager = require("./commandManager")

module.exports = {

	client: null,
	token: null,
	startRegex: null,

	init(){

		this.token = settings["discord-token"]

		this.startRegex = new RegExp(`^${settings["command-start"]}(.*)`)

		if(!this.token || this.token === ""){
			throw new Error("You need to specify a discord token")
		}

		this.client = new Discord.Client();

		this.client.on('message', (message) => {
			this.onMessage(message)
		})
	},

	onMessage(message){
		let regexResult = this.startRegex.exec(message.content)
		if(regexResult){
			let fullCommand = regexResult[1].trim()
			let args = fullCommand.split(" ")
			try {
			    logger.info(`Command issued : ${fullCommand}`)
				let commandResult = CommandManager.getCommand(args)
                commandResult.message = message
                commandResult.command.execute(commandResult)
			} catch(e) {
				if(e instanceof CommandError) {
				    message.channel.send(`**Erreur :** ${e.message}`)
                } else {
				    logger.error(e)
                    logger.error(`Error during execution of command "${fullCommand} : ${e.message}`)
                }
			}
		}
	},

	login(callback){
		this.client.login(this.token)
			.then(()=>{
                if(callback){
                    this.client.once("ready",()=>callback())
                }
			}).catch((err)=>{
            	logger.error("Unable to start discord Bot")
				logger.error(err.message)
				process.exit(1)
			})
	}
}