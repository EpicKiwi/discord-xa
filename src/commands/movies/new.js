const Command = require("../../Command")
const allocine = require("allocine-api")
const movieDisplay = require("./lib/movieDisplay")

const com = new Command("new")

com.description.short = "Affiche les films actuellement à l'affiche"
com.description.long = `Affiche les 30 films les plus populaires à l'affiche dans toute la france. Les informations sont extraites de l'API Allociné.

Les informations affichés sont les suivantes:
- Titre
- Réalisateur`

com.execute = (commandResult) => {
	allocine.api('movielist', {filter: 'nowshowing', order: 'toprank', count:30}, (error, results) => {
	    if(error) {
	    	console.error(error); 
	    	com.logger.error(`Error while getting movies : ${error.message}`)
	    	return; 
	    }
	    if(results.feed.movie){
		    let formatedMovieList = movieDisplay.movieListRender(results.feed.movie,{date:false})
		    commandResult.reply(`Films en salle actuellement :\n\n${formatedMovieList}`)
		} else {
		    commandResult.reply(`Il n'y a apparemment aucun film en salle`)
		}
	});
}

com.categoryDefault = true

module.exports = com