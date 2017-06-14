const Discord = require("discord.js")
const settings = require("./settings")
const logger = require("./logger")

module.exports = {

	client: null,
	token: null,
	startRegex: null,

	init(){

		this.token = settings["discord-token"]

		this.startRegex = new RegExp(`^${settings["command-start"]}(.*)`)

		if(!this.token || this.token == ""){
			throw new Error("You need to specify a discord token")
		}

		this.client = new Discord.Client();

		this.client.on('message', (message) => {
			this.onMessage(message)
		});
	},

	onMessage(message){
		let regexResult = this.startRegex.exec(message.content)
		if(regexResult){
			let fullCommand = regexResult[1].trim()
			let args = fullCommand.split(" ")
			try {
				commandManager.execCommand(args)
			} catch(e) {
				logger.warn(`Unknown command for "${fullCommand}"`)
			}
		}
	},

	login(callback){
		if(callback){
			this.client.once("ready",()=>callback())
		}
		this.client.login(this.token)
	}

}