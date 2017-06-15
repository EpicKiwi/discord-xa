const fs = require("fs-extra")
const logger = require("./logger") 
const path = require("path")
const Command = require("./Command")
const CommandCategory = require("./CommandCategory")
const CommandNotFoundError = require("./CommandNotFoundError")
const CommandResult = require("./CommandResult")

module.exports = {
	
	commands: new CommandCategory("index"),

	commandsDir: path.join(__dirname,"./commands"),

	ignoredFolders : ["lib"],

	load(){
		this.loadCommandDir(this.commandsDir,this.commands)
	},

	loadCommand(filepath){
		logger.info(`Loading command from ${path.basename(filepath)}`)
		return require(filepath)
	},

	loadCommandDir(dirPath,rootScope){
		let commandsDir = fs.readdirSync(dirPath)
		commandsDir.forEach((el)=>{
			let elPath = path.join(dirPath,el)
			let stats = fs.statSync(elPath)
			if(stats.isDirectory() && this.ignoredFolders.indexOf(el) == -1){
				let category = new CommandCategory(el)
				rootScope.addCategory(category)
				this.loadCommandDir(elPath,category)
			} else if (stats.isFile() && path.extname(el) == ".js"){
				try{
					let command = this.loadCommand(elPath)
					if(command.categoryDefault){
						rootScope.default = command
					}
					rootScope.addCommand(command)
				} catch(e) {
					console.error(e)
					logger.error(`Error while loading ${el} : ${e.message}`)
				}
			}
		})
	},

	getCommand(args, category, depth){
	    if(!category)
	        category = this.commands
        if(!depth)
            depth = 0
        let next = category.content[args[depth]]
		let commandArgs = args.slice(0)
        if(next){
            if(next instanceof CommandCategory)
                return this.getCommand(args,next,depth+1)
            else if(next instanceof Command) {
		        commandArgs.splice(0,depth+1)
                return new CommandResult(next, commandArgs, args)
            }
        } else {
            if(category.default){
		        commandArgs.splice(0,depth)
                return new CommandResult(category.default,commandArgs,args,true)
            }
            throw new CommandNotFoundError();
        }
    }
}