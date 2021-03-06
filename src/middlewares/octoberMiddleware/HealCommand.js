const Command = require("../commandMiddleware/commands/Command")
const OctoberMiddleware = require("./OctoberMiddleware")
const PlayerStore = require("../../stores/PlayerStore")
const Discord = require("discord.js")
const settings = require("../../settings")

class StatusCommand extends Command {

    static getName(){return "Heal"}
    static getDescription(){return "Soigne un personnage"}
    static getCommandName(){return "heal"}

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

        if(isSelf)
            return await this.action.reply("Vous ne pouvez pas vous soigner vous même")

        let player = await PlayerStore.state.findOne({
            server: this.action.message.guild.id,
            user: target.id
        })

        if(!player)
            return await this.action.reply("Qui ?? Connait pas...")

            if(this.action.message.author.bot){
                return await this.action.reply(`Malgré tout ses efforts, ${this.action.message.author} n'a pas réussi à soigner ${target} avec ses petits bras de robot`)
            }

        if(Math.random() > 0.80)
            return await this.action.reply(`Malgré tout ses efforts, ${this.action.message.author} n'a pas réussi à soigner ${target}`)

        let healAmount = Math.min(player.health+settings.octoberEvent.healAmount,player.maxHealth) - player.health
        player.health += healAmount
        await PlayerStore.updatePlayerAction(player)

        await this.action.reply(`${this.action.message.author} à soigné ${target} de ${healAmount} points de vie`)
    }

}

module.exports = StatusCommand