const CommandError = require("../../../CommandError")
const Track = require("./Track")
const logger = require("../../../logger")

module.exports = {

	joinedGuilds: {},

	guildsPlaylists: {},

	providers: [
		require("./providers/youtube")
	],

	init(){
		this.providers.forEach((el)=>el.init())
	},

	addTrack(guild,url){
		let provider = this.providers.find((el)=>el.matchUrl(url))
		if(!provider){
			throw new CommandError("Cette URL n'est pas supportée")
		}
		if(!this.guildsPlaylists[guild.id]){
			this.guildsPlaylists[guild.id] = []
		}
		let track = new Track(url,provider)
		this.guildsPlaylists[guild.id].push(track)
		if(this.guildsPlaylists[guild.id].length == 1 && !this.isPlayingOn(guild)){
			this.play(guild)
		}
	},

	isPlayingOn(guild){
		return this.joinedGuilds[guild.id] !== undefined
	},

	play(guild){
		if(this.isPlayingOn(guild))
			throw new CommandError("Je joue déjà sur ce serveur")
		if(this.guildsPlaylists[guild.id].length < 1)
			throw new CommandError("Il n'y a aucun titre dans la playlist")
		let channel = this.getGuildChannel(guild)
		channel.join()
		.then((connection) => {
			this.joinedGuilds[guild.id] = connection
			this.playTrack(connection,this.guildsPlaylists[guild.id].shift())
			connection.once('disconnect',()=>{
				this.joinedGuilds[guild.id] = undefined
			})
		})
	},

	playTrack(connection,track){
		let stream = track.getStream()
		let dispatcher = connection.playStream(stream)
		let guild = connection.channel.guild
		logger.info(`Playing track on ${guild.name}`)
		dispatcher.once('end',()=>{
			if(this.guildsPlaylists[guild.id].length > 0){
				return this.playTrack(connection,this.guildsPlaylists[guild.id].shift())
			} else {
				connection.channel.leave()
			}
		})
	},

	getGuildChannel(guild){
		return guild.channels.array().find((el)=>el.type == 'voice')
	},

	stop(guild){
		//TODO
	}

}