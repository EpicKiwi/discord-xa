const Command = require("./Command")

module.exports = class CommandCategory {

	constructor(name){
		this.content = {}
		this.default = null
		this.name = name
	}

	addCommand(command){
		if(!(command instanceof Command)){
			throw new Error(`${command} is not a valid command`)
		}
		this.content[command.name] = command
		command.init()
	}

	addCategory(category){
		if(!(category instanceof CommandCategory)){
			throw new Error(`${category} is not a valid category`)
		}
		this.content[category.name] = category
	}

	setDefault(command){
		if(this.default){
			throw new Error(`There can be only one default command, currently ${this.default.name}`)
		}
		if(!(command instanceof Command)){
			throw new Error(`${command} is not a valid command`)
		}
	}

}