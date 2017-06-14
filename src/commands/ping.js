const Command = require("../Command")

const com = new Command("ping",["logger"])

com.execute = (args,message)=>{
	com.logger.info("Pingged")
}

module.exports = com;