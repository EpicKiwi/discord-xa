const allocine = require("allocine-api")
const Command = require("../../Command")
const movieDisplay = require("./lib/movieDisplay")

const com = new Command("search",["logger","CommandError"])

com.description.short = "Recherche un film"

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
		    let formatedMovieList = movieDisplay.movieListRender(results.feed.movie)
		    commandResult.reply(`Résultat de la recherche pour *${joinedArgs}* :\n\n${formatedMovieList}`)
		} else {
		    commandResult.reply(`Aucun résultat pour *${joinedArgs}*`)
		}
	});
}

module.exports = com