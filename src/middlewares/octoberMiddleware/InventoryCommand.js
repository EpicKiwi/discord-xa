const Command = require("../commandMiddleware/commands/Command")
const OctoberMiddleware = require("./OctoberMiddleware")

class InventoryCommand extends Command {

    static getName(){return "Inventory"}
    static getDescription(){return "Donne le contenue de l'inventaire de la personne"}
    static getCommandName(){return "inventory"}

    constructor(contentOrCommand,action,middleware){
        super(contentOrCommand,action,middleware)
    }

    async execute(){

        if(this.action.message.channel.type != "text")
            return await this.action.reply("Vous devez vous situer sur un serveur pour utiliser cette commande")

        let invDoc = await OctoberMiddleware.inventorydb.findOne({
            server: this.action.message.guild.id,
            user: this.action.message.author.id
        })

        if(!invDoc || !invDoc.item)
            return await this.action.reply(`${this.action.message.author}, votre inventaire est vide...`)

        let item = OctoberMiddleware.items.find((el) => el.name == invDoc.item)

        if(!item)
            return await this.action.reply(`${this.action.message.author}, il semble que votre inventaire contienne l'item **${invDoc.item}** mais je ne connait pas ces caractéristiques...`)

        let embed = item.toEmbed()

        this.action.reply(`L'inventaire de ${this.action.message.author}`,embed)
    }

}

module.exports = InventoryCommand