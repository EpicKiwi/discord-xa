const Command = require("../commandMiddleware/commands/Command")
const PlayerStore = require("../../stores/PlayerStore")
const OctoberMiddleware = require("./OctoberMiddleware")

class UseCommand extends Command {

    static getName(){return "Utiliser un objet"}
    static getDescription(){return "Permet d'utiliser l'item de son inventaire sur quelqu'un"}
    static getCommandName(){return "use"}

    constructor(contentOrCommand,action,middleware){
        super(contentOrCommand,action,middleware)
    }

    async execute(){

        if(!this.bot)
            this.bot = require("../../bot")

        if(this.action.message.channel.type != "text")
            return await this.action.reply("Vous devez vous situer sur un serveur pour utiliser cette commande")

        let target = Array.from(this.action.message.mentions.users.values())[0]

        if(!target)
            return await this.action.reply("Vous devez mentionner une cible")

        if(target.presence.status == "offline")
            return await this.action.reply(`${target} doit être disponible pour utiliser cet item...`)

        let player = await PlayerStore.state.findOne({
            server: this.action.message.guild.id,
            user: this.action.message.author.id
        })

        if(!player || !player.inventory)
            return await this.action.reply(`${this.action.message.author}, votre inventaire est vide...`)

        player = PlayerStore.parsePlayer(player)

        if(player.outOfCombat){
            return await this.action.reply(`${this.action.message.author}, vous n'êtes pas en etat d'utiliser ça...`)
        }

        let item = OctoberMiddleware.items.find((el) => el.name == player.inventory.name).clone()
        Object.assign(item,player.inventory)
        player.inventory = item

        if(target.id == this.bot.client.user.id)
            return await this.action.reply("Je ne suis qu'amour, vous ne pouvez pas utiliser cet item sur moi...")

        let targetPlayer = await PlayerStore.state.findOne({
            server: this.action.message.guild.id,
            user: target.id
        })

        if(!targetPlayer){
            if(target.bot){
                return await this.action.reply("Inutile d'utiliser votre item sur lui, il ne vous fera rien...")
            } else {
                targetPlayer = new PlayerStore.HumanPlayer(this.action.message.guild.id,target.id)
            }
        } else {
            targetPlayer = PlayerStore.parsePlayer(targetPlayer)
        }

        let result = item.use()
        if(result.destroyed)
            player.inventory = null

        targetPlayer.health -= result.damages
        targetPlayer.health = Math.min(targetPlayer.health,targetPlayer.maxHealth)

        await PlayerStore.updatePlayerAction(player)
        if(player.user != targetPlayer.user) {
            await PlayerStore.updatePlayerAction(targetPlayer)
        }

        let message = `${this.action.message.author} utilise **${item.name}** sur `

        if(target.id == this.action.message.author.id)
            message += "sa personne"
        else
            message += `${target}`

        message += "\n"

        message += `${target} `

        if(result.damages == 0)
            message += "ne prend pas de dégats"
        else
            message += `prend ${result.damages} dégats`

        if(result.critical)
            message += " et **c'est un coup critique !**"

        message += "\n"

        if(result.destroyed){
            message += `${this.action.message.author} a détruit son item **${item.name}**\n`
        }

        if(targetPlayer.outOfCombat){
            message += `${target} est **hors de combat**`
        }

        await this.action.reply(message);

        if(targetPlayer.outOfCombat && targetPlayer.type == "MONSTER"){
            let mmonster = OctoberMiddleware.managedMonsters.find((el) =>
                el.user == targetPlayer.user &&
                el.server == targetPlayer.server)
            if(mmonster)
                await mmonster.disapear();
        }

    }

}

module.exports = UseCommand