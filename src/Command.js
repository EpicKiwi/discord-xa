const logger = require("./logger")

module.exports = class Command {

	constructor(name,dependancies){
		if(!name){
			throw new Error("The command must have a name")
		}
		if(!name.match(/^[a-z-]+$/)){
			throw new Error("The command must contains only lowercase and \"-\" characters")
		}
		this.name = name
		if(dependancies){
			dependancies.forEach((dependency)=>{
				this[dependency] = require("./"+dependency)
			})
		}
		this.categoryDefault = false;
		this.functions = {}
		this.description = {
			short: "Aucune aide sur cette commande",
			params: "",
			long: "Il n'y a pas de documentation sur cette commande, veuillez contacter mon responsable :wink:"
		}
	}

	init(){}

	execute(commandResult){
		logger.warn(`Command ${this.name} doesn't implement "execute" function. This command is useless !`)
	}

}