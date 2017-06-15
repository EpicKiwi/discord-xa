const allocine = require("allocine-api")
const Command = require("../../Command")

const com = new Command("search",["logger","CommandError"])

const formatMovieList = function(movieList){
	let response = ""

	movieList.forEach((movie)=>{

		if(movie.title){
			let title = movie.title
			response += `**${title}**`
		} else if(movie.originalTitle) {
			let originalTitle = movie.originalTitle
			response += `**${originalTitle}**`
		} else {
			return
		}

		if(movie.castingShort && movie.castingShort.directors){
			let directors = movie.castingShort.directors.split(", ")
			response += ` de ${directors[0]}`
		}

		if(movie.release && movie.release.releaseDate){
			let releaseDate = new Date(movie.release.releaseDate)
			response += ` sorti en *${releaseDate.getFullYear()}*`
		} else if (movie.productionYear) {
			response += ` produit en *${movie.productionYear}*`
		}

		response += `\n`
	})

	return response

}

com.execute = function(commandResult){
	let joinedArgs = commandResult.args.join(" ")
	if(joinedArgs == ""){
		throw new com.CommandError("Vous devez entrer une recherche")
	}
	
	allocine.api('search', {q: joinedArgs, filter: 'movie'}, (error, results) => {
	    if(error) {
	    	console.error(error); 
	    	com.logger.error(`Error while getting movies : ${error.message}`)
	    	return; 
	    }
	    if(results.feed.movie){
		    let formatedMovieList = formatMovieList(results.feed.movie)
		    commandResult.reply(`Résultat de la recherche pour *${joinedArgs}* :\n\n${formatedMovieList}`)
		} else {
		    commandResult.reply(`Aucun résultat pour *${joinedArgs}*`)
		}
	});
}

module.exports = com