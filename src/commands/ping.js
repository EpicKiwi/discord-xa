const Command = require("../Command")

const com = new Command("ping")

com.description.short = "Renvoie pong"

com.execute = (commandResult)=>{
	let message = commandResult.message
	let args = commandResult.args
	if(args[0])
		message.channel.send(`Pong ${args[0]}`)
	else
        message.channel.send("Pong")
}

module.exports = com;