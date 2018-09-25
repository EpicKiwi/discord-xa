const Command = require("../commandMiddleware/commands/Command")
const OctoberMiddleware = require("./OctoberMiddleware")
const diacritics = require("diacritics")

class ItemCommand extends Command {

    static getName(){return "Item info"}
    static getDescription(){return "Donne toutes les informations à propos d'un item par son nom"}
    static getCommandName(){return "iteminfo"}

    constructor(contentOrCommand,action,middleware){
        super(contentOrCommand,action,middleware)
    }

    async execute(){

        let search = diacritics.remove(this.args.join(' ')).toLowerCase()
        let item = OctoberMiddleware.items.find((el) => diacritics.remove(el.name).toLowerCase() == search)

        if(!item)
            return await this.action.reply(`Impossible de trouver **${this.args.join('')}** dans ma base de données`)

        await this.action.reply("",item.toEmbed())
    }

}

module.exports = ItemCommand