const allocine = require("allocine-api")
const Command = require("../../Command")
const movieDisplay = require("./lib/movieDisplay")

const com = new Command("details",["logger","CommandError"])

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

		    	commandResult.reply(movieDisplay.fullMovieRender(results.movie))
			})
		} else {
		    commandResult.reply(`Aucun résultat pour *${joinedArgs}*`)
		}
	});
}

module.exports = com