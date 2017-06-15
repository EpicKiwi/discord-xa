const allocine = require("allocine-api")
const Command = require("../../Command")

const com = new Command("details",["logger","CommandError"])

let formatMovie = function(movie){
	let response = ""

	if(movie.title){
		let title = movie.title
		response += `**${title}**`
	} else if(movie.originalTitle) {
		let originalTitle = movie.originalTitle
		response += `**${originalTitle}**`
	}

	if(movie.movieType){
		let type = movie.movieType["$"]
		response += ` - ${type}`
	}

	if(movie.genre){
		let genres = movie.genre
		genres = genres.map((genre) => genre["$"])
		response += ` - ${genres.join(", ")}`
	}
	
	response += `\n\n`

	if(movie.synopsis){
		response += `${movie.synopsis.replace(/(<([^>]+)>)/ig,"")}`
	}else if(movie.synopsisShort){
		response += `${movie.synopsisShort.replace(/(<([^>]+)>)/ig,"")}`
	}
	
	response += `\n\n`

	if(movie.release && movie.release.releaseDate){
		let releaseDate = new Date(movie.release.releaseDate)
		response += `**Année de sortie** : ${releaseDate.getFullYear()}\n`
	} else if (movie.productionYear) {
		response += `**Année de production** : ${movie.productionYear}\n`
	}

	if(movie.castMember){
		let directors = movie.castMember.filter((el)=>el.activity.code == 8002)
		let actors = movie.castMember.filter((el)=>el.activity.code == 8001)
		let directorsNames = directors.map((el)=>el.person.name)
		if(directorsNames.length > 1){
			response += `**Réalisateurs** : ${directorsNames.join(", ")}\n`
		} else if(directorsNames.length == 1){
			response += `**Réalisateur** : ${directorsNames[0]}\n`
		}
		if(actors.length > 0){
			let actorsRender = actors.map((actor)=>{
				if(actor.role)
					return `*${actor.person.name}* (${actor.role})`
				else
					return `${actor.person.name}`
			})
			response += `**Acteurs** : ${actorsRender.join(" - ")}`
		}
	}
	
	response += `\n`

	if(movie.poster){
		response += `**Affiche** : ${movie.poster.href}`
	}

	return response
}

com.execute = (commandResult) => {

	let joinedArgs = commandResult.args.join(" ")

	if(joinedArgs == ""){
		throw new com.CommandError("Vous devez entrer une recherche")
	}

	allocine.api('search', {q: joinedArgs, filter: 'movie', count: 1}, (error, results) => {
	    if(error) {
	    	console.error(error); 
	    	com.logger.error(`Error while getting movies : ${error.message}`)
		    commandResult.reply(`Impossible de récupèrer les résultats`)
	    	return; 
	    }
	    if(results.feed.movie){
		    let movie = results.feed.movie[0]
		    allocine.api('movie', {code: movie.code, profile: "large"}, (error, results) => {
			    if(error) {
			    	console.error(error); 
			    	com.logger.error(`Error while getting movie : ${movie.code}`)
				    commandResult.reply(`Impossible de récupèrer le film`)
			    	return;
			    }

		    	commandResult.reply(formatMovie(results.movie))
			})
		} else {
		    commandResult.reply(`Aucun résultat pour *${joinedArgs}*`)
		}
	});
}

module.exports = com