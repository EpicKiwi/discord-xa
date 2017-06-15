const Command = require("../../Command")
const path = require("path")
const ytdl = require("ytdl-core")

const com = new Command("music",["CommandError"])

var voiceConnection = null

com.execute = (commandResult) => {
	let url = commandResult.args[0]
	if(!url.match("youtube"))
		throw new com.CommandError("Vous devez me donner une URL youtube valide")
	let channel = commandResult.message.guild.channels.array().filter((el)=>el.type == 'voice')[0]
	if(!channel)
		throw new com.CommandError("Il n'y a pas de channel vocal sur ce serveur")
	if(voiceConnection)
		throw new com.CommandError("Je suis déjà connecté a un channel vocal")
	channel.join().then((connection)=>{
		let streamDisp = connection.playStream(ytdl(url,{filter:"audioonly"}))
		voiceConnection = connection
		streamDisp.once("end",()=>{
			channel.leave()
			voiceConnection = null;
		})
	})
}

com.categoryDefault = true

module.exports = com