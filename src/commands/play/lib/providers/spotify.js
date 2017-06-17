//Ce module ne fonctionne pas a cause de spotify qui met une captcha a la connexion
// :(

const Provider = require("../Provider")
const spotify = require("spotify-web")
const settings = require("../../../../settings")
const logger = require("../../../../logger")

const pro = new Provider("Spotify",/open\.spotify\.com\/track\/(.+)$/)

var session = null

pro.init = () => {
	logger.info(`Logging in to spotify with username ${settings.spotify.username}`)
	spotify.login(settings.spotify.username,settings.spotify.password,(err,sptfy)=>{
		if(err){
			console.error(err)
			logger.error(`Error while logging in to spotify : ${err.message}`)
			return
		}
	})
}

pro.getStream = (track) => {

}

module.exports = pro