const Command = require("../../Command")
const path = require("path")
const playlistManager = require("./lib/playlistManager")

const com = new Command("music",["CommandError"])

com.execute = (commandResult) => {
	let url = commandResult.args[0]
	if(!url)
		throw new com.CommandError("Vous devez donner une URL")
	if(!commandResult.message.guild)
		throw new com.CommandError("Vous devez vous trouver sur un serveur avec un channel vocal")
	let channel = commandResult.message.guild.channels.array().filter((el)=>el.type == 'voice')[0]
	if(!channel)
		throw new com.CommandError("Il n'y a pas de channel vocal sur ce serveur")
	playlistManager.addTrack(commandResult.message.guild,url)
	commandResult.reply("Titre ajouté à la playlist")
}

com.init = ()=>{
	playlistManager.init()
}

com.categoryDefault = true

module.exports = com