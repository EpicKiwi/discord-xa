const Command = require("../commandMiddleware/commands/Command")
const OctoberMiddleware = require("./OctoberMiddleware")
const PlayerStore = require("../../stores/PlayerStore")
const Discord = require("discord.js")

class StatusCommand extends Command {

    static getName(){return "Status"}
    static getDescription(){return "Donne le status d'un personnage"}
    static getCommandName(){return "status"}

    constructor(contentOrCommand,action,middleware){
        super(contentOrCommand,action,middleware)
    }

    async execute(){

        if(this.action.message.channel.type != "text")
            return await this.action.reply("Vous devez vous situer sur un serveur pour utiliser cette commande")

        let target = Array.from(this.action.message.mentions.users.values())[0]
        let isSelf = false

        if(!target) {
            target = this.action.message.author
            isSelf = true
        } else {
            isSelf = target.id == this.action.message.author.id
        }

        let player = await PlayerStore.state.findOne({
            server: this.action.message.guild.id,
            user: target.id
        })

        let embed = new Discord.RichEmbed()
        embed.setThumbnail(await target.avatarURL)
        embed.setTitle(target.username)

        if(player){
            embed.addField("Santé",`${player.health}/${player.maxHealth}`,true)
            if(player.inventory){
                embed.addField("Inventaire",player.inventory.name,true)
                if(isSelf) {
                    embed.setFooter("Tapez `> inventory` pour voir votre inventaire en detail")
                } else {
                    embed.setFooter(`Tapez \`> item ${player.inventory.name}\` pour voir les détails de l'item`)
                }
            } else {
                embed.addField("Inventaire","*vide*",true)
            }
        } else {
            embed.addField("C'est un peu vide ici...","Je n'ai aucune information sur ce joueur")
        }

        this.action.reply("",embed)
    }

}

module.exports = StatusCommand