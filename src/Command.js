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
	}

	execute(args,message){
		logger.warn(`Command ${this.name} doesn't implement "execute" function. This command is useless !`)
	}

}