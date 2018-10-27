const Injectable = require("../../core/Injectable")

module.exports = class Command extends Injectable {

    /**
     * The command name used to match with the command line
     * This name needs to respect [a-zA-Z0-9]* and is case INsensitive
     */
    static get commandName(){
        return null;
    }

    async execute(commandMessage){
        throw new Error(`Pleay override the "execute" function in ${this.constructor.name}`)
    }

}