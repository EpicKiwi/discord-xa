const Command = require("../Command")

const com = new Command("help",["commandManager","Command","CommandCategory","CommandError"])

com.description.short = "Donne une aide sur chaque commande"

com.functions.formatCategory = function formatCategory(category,path){
    let result = path != "" ?`Aide sur **${path}**` : `Aide général`
    for(let id in category.content){

        result += `\n\n\t`

        if(category.content[id] instanceof com.CommandCategory){
            result += `:small_blue_diamond: `
        } else if(category.content[id] instanceof com.Command) {

            if(category.default === category.content[id]){
                result += `:large_orange_diamond: `
            } else {
                result += `:small_orange_diamond: `
            }

        }

        result += `**${id}**`

        if(category.content[id] instanceof com.CommandCategory){
            result += ` ...`
        }

        result += `\n\t\t`

        if(category.content[id] instanceof com.Command){
            result += `${category.content[id].description.short}`
        } else if(category.content[id] instanceof com.CommandCategory) {
            result += `${category.content[id].default.description.short}`
        }

    }
    return result
}

com.functions.formatCommand = function formatCategory(command,path) {
    let result = `Aide sur **${command.name}**`
    result += `\n\n\t:small_orange_diamond: **${path}** ${command.description.params}`
    result +=`\n\t${command.description.short}`
    result += `\n\n${command.description.long}`
    return result
}

com.execute = (commandResult)=>{
    let message = commandResult.message
    let args = commandResult.args

    let path = ``
    let category = com.commandManager.commands;

    for(let index in args){
        let arg = args[index]
        let newcat = category.content[arg]
        if(newcat) {
            category = newcat
            path += `${arg} `
        }
        else
            throw new com.CommandError(`Commande ${arg} inconnue`)
    }

    path.trim()

    if(category instanceof com.Command){
        commandResult.reply(com.functions.formatCommand(category,path))
    } else if (category instanceof com.CommandCategory){
        commandResult.reply(com.functions.formatCategory(category,path))
    } else {
        throw new com.CommandError("Invalid object to show")
    }
}

module.exports = com;