const Command = require("../Command")
const allocine = require("allocine-api")
const logger = require("../../../../logger")
const movieDisplay = require("./movieDisplay")

class MoviesNewsCommand extends Command {

    static getName(){return "Movie details"}
    static getDescription(){return "Affiche diverses informations sur un film"}
    static getCommandName(){return "movie details"}

    constructor(contentOrCommand,action,middleware){
        super(contentOrCommand,action,middleware)
    }

    execute(){ return new Promise((resolve, reject) => {
        let joinedArgs = this.args.join(" ")

        if(joinedArgs == ""){
            throw new com.CommandError("Vous devez entrer une recherche")
        }

        allocine.api('search', {q: joinedArgs, filter: 'movie', count: 1}, (error, results) => {
            if(error) {
                console.error(error);
                logger.error(`Error while getting movies : ${error.message}`)
                this.action.reply(`Impossible de récupèrer les résultats`)
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

                    this.action.reply("",movieDisplay.fullMovieRender(results.movie))
                })
            } else {
                this.action.reply(`Aucun résultat pour *${joinedArgs}*`)
            }
        });
    })}


}

module.exports = MoviesNewsCommand