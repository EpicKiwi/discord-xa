const allocine = require("allocine-api")
const Command = require("../../Command")
const movieDisplay = require("./lib/movieDisplay")

const com = new Command("search",["logger","CommandError"])

com.description.params = "<titre>"
com.description.short = "Recherche un film"
com.description.long = `Recherche un film sur le site Allociné par son titre.

Les informations affichés sont les suivantes :
- Titre
- Année
- Réalisateur`

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
			formatedMovieList.title = joinedArgs
			formatedMovieList.description = `Résultat de la recherche pour *${joinedArgs}*\n`;
		    commandResult.reply("",formatedMovieList)
		} else {
		    commandResult.reply(`Aucun résultat pour *${joinedArgs}*`)
		}
	});
}

module.exports = com