const Command = require("../Command")
const Discord = require("discord.js");

const com = new Command("help",["commandManager","Command","CommandCategory","CommandError"])

com.description.short = "Donne une aide sur chaque commande"

com.description.params = "[commande] [...]"
com.description.short = "Donne une aide sur chaque commande"
com.description.long = `Cette commande affiche l'aide disponible pour une commande ou une catégorie de commande.

Les commandes sont organisés en catégories permettant de créer un arboréscence de commandes. Dans l'aide, les commandes sont signalés par le signe :small_orange_diamond:. Les catégories sont signalés par le signe :small_blue_diamond:. Vous pouvez naviguer de catégories en catégories pour en afficher le contenu en donnant le chemin absolu en paramètre de la commande *help*. 
Chaque catégorie dispose d'une commande par defaut s'éxécutant quand la catégorie est éxécutée. La commande par défaut se distingue des autres commandes par le signe :large_orange_diamond: dans l'aide de la catégorie.

L'aide d'une commande se sépare en 3 parties.
Le chemin et les paramètres donnent la syntaxe à utiliser pour éxécuter la commande. Les paramètres entre crochets *[]* sont facultatifs quand les paramètres entre chevrons *<>* sont obligatoirs. Le paramètre facultatif *[...]* signifie que l'on peut donner un nombre non définis de paramètres du type précédent.
La courte déscription donne une description succinte de la commande
Enfin, la longue description donne tout les details sur l'utilisation de la commande.`

com.functions.formatCategory = function formatCategory(category,path){
    let result = []
    for(let id in category.content){

        let currentField = {
            name: "",
            value: ""
        }

        if(category.content[id] instanceof com.CommandCategory){
            currentField.name += `:small_blue_diamond: `
        } else if(category.content[id] instanceof com.Command) {

            if(category.default === category.content[id]){
                currentField.name += `:large_orange_diamond: `
            } else {
                currentField.name += `:small_orange_diamond: `
            }

        }

        currentField.name += `**${path} ${id}**`

        if(category.content[id] instanceof com.CommandCategory){
            if(category.content[id].default.description.params)
                currentField.name += ` ${category.content[id].default.description.params}`
            currentField.name += ` ...`
        } else if(category.content[id] instanceof com.Command) {
            currentField.name += ` ${category.content[id].description.params}`
        }

        if(category.content[id] instanceof com.Command){
            currentField.value += `${category.content[id].description.short}`
        } else if(category.content[id] instanceof com.CommandCategory) {
            currentField.value += `${category.content[id].default.description.short}`
        }

        result.push(currentField);
    }
    return new Discord.RichEmbed({
        title: path != "" ?`Aide sur **${path}**` : `Aide général`,
        color: 4868682,
        fields: result
    });
}

com.functions.formatCommand = function formatCommand(command,path) {
    let paragraphs = command.description.long.split("\n\n")
        .map((el) => {return {value: el,name:"---"}})
        .filter((el) => el.value);
    paragraphs.splice(0,1);
    let result = new Discord.RichEmbed({
        title: `Aide sur **${command.name}**`,
        color: 4868682,
        fields: [
            {
                name: "Structure",
                value: `:small_orange_diamond: **${path}** ${command.description.params}`
            },
            {
                name: "Description courte",
                value: command.description.short
            },
            {
                name: "Description complète",
                value: command.description.long.split("\n")[0]
            },
            ...paragraphs
        ]
    });
    return result;
}

com.functions.sendHelp = function sendHelp(channel,category,path){
    if(category instanceof com.Command){
        channel.send("",com.functions.formatCommand(category,path))
    } else if (category instanceof com.CommandCategory){
        channel.send("",com.functions.formatCategory(category,path))
    } else {
        throw new com.CommandError("Invalid object to show")
    }
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

    path = path.trim()

    if(commandResult.message.author.dmChannel){
        com.functions.sendHelp(commandResult.message.author.dmChannel,category,path)
    } else {
        commandResult.message.author.createDM()
            .then((channel)=>{
                com.functions.sendHelp(channel,category,path)
            })
    }

    if(commandResult.message.channel.type != "dm"){
        commandResult.reply("J'ai ouvert l'aide dans votre espace privé")
    }
}

module.exports = com;