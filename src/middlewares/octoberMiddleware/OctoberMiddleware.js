const Middleware = require("../lib/Middleware")
const logger = require("../../logger")
const db = require("../../Database")
const settings = require("../../settings")
const Item = require("./Item")

class OctoberMiddleware extends Middleware {

    constructor(){
        super()

        this.messageCount = 0
        this.dropMessages = []

        this.restrictedChannels = settings.octoberEvent.channelRestriction
        this.tickRate = 1000
        this.drop = settings.itemDrop

        this.inventorydb = db.createCollection("OctoberMiddleware","inventory")
        this.monstersdb = db.createCollection("OctoberMiddleware","monsters")
        this.items = settings.items.map((el) => Item.fromJson(el))
    }

    async init(){
        this.bot = require("../../bot")
        setTimeout(() => this.applyTick(), this.tickRate)
    }

    async applyTick(){
        await this.tick()
        setTimeout(() => this.applyTick(), this.tickRate)
    }

    async tick(){

    }

    async onMessage(action){
        if(this.restrictedChannels.indexOf(action.message.channel.name) == -1)
            return
        if(action.message.channel.type != "text")
            return
        if(action.message.author.id == this.bot.client.user.id || action.isCommand)
            return

        this.messageCount++

        let chances = Math.max(this.messageCount-this.drop.minMessage,0)/
            this.drop.maxMessage
        let rdm = Math.random()

        if(rdm < chances){
            this.dropItem(action.message.channel)
            this.messageCount = 0
        }

    }

    async dropItem(channel){
        let total = this.items.reduce((acc,el) => acc+el.dropChances, 0)

        let filler = 0
        let objective = Math.random()

        let item = this.items.find((el) => {
            filler += el.dropChances / total
            return filler >= objective
        })

        let embed = item.toEmbed();
        embed.setFooter("Équipez vous de cet item avec ✅ . Cela vous fera perdre votre ancien équipement.")

        let message = await channel.send(embed)

        await message.react("✅")
        await message.react("❌")

        this.dropMessages.push({message:message,item:item})
    }

    async onReactionAdded(action){
        if(action.reaction._emoji.name != "✅" || action.reaction.users.keyArray().length < 2)
            return

        let dropMessage = this.dropMessages.find((el) => el.message.id == action.reaction.message.id)

        if(!dropMessage)
            return

        let user = Array.from(action.reaction.users.values())
            .find((el) => el.id != this.bot.client.user.id)

        this.dropMessages.splice(this.dropMessages.indexOf(dropMessage),1)

        console.log(this.dropMessages)

        let invDoc = await this.inventorydb.findOne({
            server: action.reaction.message.guild.id,
            user: user.id
        })

        if(!invDoc){
            await this.inventorydb.insert({
                server: action.reaction.message.guild.id,
                user: user.id,
                item: null,
                lifetime: null
            })
        }

        await this.inventorydb.update({
            server: action.reaction.message.guild.id,
            user: user.id
        },{
            $set: {
                item: dropMessage.item.name,
                lifetime: dropMessage.item.lifetime
            }
        })

        action.reaction.message.channel.send(`${user} possède maintenant l'item **${dropMessage.item.name}**`)
    }

}

module.exports = new OctoberMiddleware()