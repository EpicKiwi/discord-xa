const Command = require("../Command")

const com = new Command("ping")

com.description.params = "[chaine]"
com.description.short = "Renvoie pong"
com.description.long = `Renvoie simplement "pong" suivi de l'éventuel chaine donnée par le paramètre *[chaine]*. Cette commande permet de vérifier que je fonctionne bien :wink:`

com.execute = (commandResult)=>{
	let message = commandResult.message
	let args = commandResult.args
	if(args[0])
		message.channel.send(`Pong ${args[0]}`)
	else
        message.channel.send("Pong")
}

module.exports = com;