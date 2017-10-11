const Command = require("../Command")
const commandManager = require("../commandManager")

const com = new Command("help")

com.execute = (commandResult)=>{
    let message = commandResult.message
    let args = commandResult.args
    message.channel.send(`Implémentation en cours`)
}

module.exports = com;