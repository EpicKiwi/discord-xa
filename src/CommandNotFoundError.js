const CommandError = require("./CommandError")
module.exports = class CommandNotFoundError extends CommandError {

    constructor(){
        super("Commande inexistante")
    }
    
}