const Command = require("../../../Command")

const com = new Command("flowers",["CommandError"])

com.execute = (commandResult)=>{
	if(commandResult.args[0]) {
        let number = parseInt(commandResult.args[0])
		if(number != NaN && number > 0)
            commandResult.message.channel.send(`Hello ${number} flowers`)
		else
			throw new com.CommandError("Le nombre de fleurs doit être superieur a 0")
    } else {
		commandResult.message.channel.send("Hello flowers")
	}
}

module.exports = com;