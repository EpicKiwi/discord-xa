const Command = require("../../Command")

const com = new Command("hello",["logger"])

com.execute = (args,message)=>{
	com.logger.info("Hello home")
}

com.categoryDefault = true

module.exports = com;