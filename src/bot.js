const Discord = require("discord.js")
const settings = require("./settings")

module.exports = {

	client: null,
	token: null,

	init(){

		this.token = settings["discord-token"]

		if(!this.token || this.token == ""){
			throw new Error("You need to specify a discord token")
		}

		this.client = new Discord.Client();

		this.client.on('message', message => {
			if (message.content == 'ping') {
			    message.reply('pong');
			}
		});
	},

	login(callback){
		if(callback){
			this.client.once("ready",()=>callback())
		}
		this.client.login(this.token)
	}

}