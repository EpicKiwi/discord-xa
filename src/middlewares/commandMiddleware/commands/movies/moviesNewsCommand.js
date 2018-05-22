const Command = require("../Command")
const allocine = require("allocine-api")
const logger = require("../../../../logger")
const movieDisplay = require("./movieDisplay")

class MoviesNewsCommand extends Command {

    static getName(){return "New movies"}
    static getDescription(){return "Affiche les films actuellement à l'affiche"}
    static getCommandName(){return "movies news"}

    constructor(contentOrCommand,action,middleware){
        super(contentOrCommand,action,middleware)
    }

    execute(){ return new Promise((resolve, reject) => {
        allocine.api('movielist', {filter: 'nowshowing', order: 'toprank', count:10}, (error, results) => {
            if(error) {
                console.error(error)
                logger.error(`Error while getting movies : ${error.message}`)
                return reject(error)
            }
            if(results.feed.movie){
                let formatedMovieList = movieDisplay.movieListRender(results.feed.movie,{date:false})
                formatedMovieList.title = "À l'affiche"
                formatedMovieList.description = "Films en salle actuellement"
                formatedMovieList.url = `http://www.allocine.fr/film/aucinema/`
                this.action.reply("Films à l'affiche actuellement",formatedMovieList)
            } else {
                this.action.reply(`Il n'y a apparemment aucun film en salle`)
            }
            return resolve()
        });

    })}


}

module.exports = MoviesNewsCommand