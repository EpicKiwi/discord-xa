const Command = require("../../Command")

const com = new Command("hello")

com.execute = (commandResult)=>{
	commandResult.message.channel.send("Hello home")
}

com.categoryDefault = true

module.exports = com;