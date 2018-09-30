const Middleware = require("../lib/Middleware")
const logger = require("../../logger")
const db = require("../../Database")
const settings = require("../../settings")
const Item = require("./Item")
const _ = require("lodash")
const PlayerStore = require("../../stores/PlayerStore")
let Monster;

class OctoberMiddleware extends Middleware {

    constructor(){
        super()

        this.messageCount = 0
        this.dropMessages = []

        this.restrictedChannels = settings.octoberEvent.channelRestriction
        this.tickRate = 1000
        this.drop = settings.itemDrop
        this.lastHeal = Date.now()
        this.items = settings.items.map((el) => Item.fromJson(el))
        this.managedMonsters = [];
    }

    async init(){
        this.bot = require("../../bot")
        setTimeout(() => this.applyTick(), this.tickRate)
        this.serverId = Array.from(this.bot.client.guilds.values())[0].id
        Monster = require("./Monster")
        await this.restoreMonsters()
        //setTimeout(() => this.spawnMonster(this.serverId),2000)
    }

    async applyTick(){
        if(this.bot.ready) {
            await this.tick()
        }
        setTimeout(() => this.applyTick(), this.tickRate)
    }

    async tick(){
        await this.purgeDeadMonsters()
        await this.resolveMonsterAttacks()
        if(this.lastHeal+settings.octoberEvent.regenSpeed < Date.now()){
            let players = await PlayerStore.state.find({type:"HUMAN"})
            await Promise.all(players.map((el) => {
                PlayerStore.healPlayerAction(el.user,el.server,1)
            }))
            this.lastHeal = Date.now()
        }
    }

    async restoreMonsters(){
        let activeMonsters = await PlayerStore.state.find({type:"MONSTER"})
        let monsters = activeMonsters.map(PlayerStore.parsePlayer)
        await Promise.all(monsters.map((el) => el.init()))
        await Promise.all(monsters.map((el) => el.appear()))
        this.managedMonsters.push(...monsters)
        logger.info(`Restored state of ${activeMonsters.length} monsters`)
    }

    async resolveMonsterAttacks(){
        let activeMonsters = await PlayerStore.state.find({type:"MONSTER"})
        let availablePlayers = await PlayerStore.state.find({type:"HUMAN"})

        availablePlayers = availablePlayers.map((el) => PlayerStore.parsePlayer(el))

        availablePlayers = availablePlayers.filter((el) => {
            return !el.outOfCombat && this.bot.client.guilds.get(el.server).members.get(el.user).presence.status == 'online'
        })

        for(let monster of activeMonsters){
            if(!monster.lastAttack || monster.lastAttack+(monster.speed*1000) < Date.now()){
                if(availablePlayers.length > 0) {
                    let index = Math.floor(availablePlayers.length * Math.random())
                    let target = availablePlayers[index]
                    availablePlayers.splice(index, 1)
                    await this.monsterAttack(PlayerStore.parsePlayer(monster), target)
                }
                monster.lastAttack = Date.now()
                await PlayerStore.updatePlayerAction(monster)
            }
        }
    }

    async monsterAttack(monster,target){
        let channel = Array.from(this.bot.client.guilds.get(monster.server).channels.values())
            .find((el) => el.name == settings.octoberEvent.channelRestriction[0])
        let monsterUser = this.bot.client.guilds.get(monster.server).members.get(monster.user).user
        let targetUser = this.bot.client.guilds.get(target.server).members.get(target.user).user
        let attack = await monster.attack()

        target.health -= attack.damages
        await PlayerStore.updatePlayerAction(target)

        await this.managedMonsters
            .find((el) => el.user == monster.user && el.server == monster.server)
            .guild.channels.get(channel.id).send(attack.quote)

        let mess = `${monsterUser} attaque ${targetUser} et lui retire ${attack.damages} points de vie`
        if(attack.critical)
            mess += " et **c'est un coup critique**"
        await channel.send(mess)
    }

    async purgeDeadMonsters(){
        let activeMonsters = await PlayerStore.state.find({type:"MONSTER"})
        let deadMonsters = await Promise.all(activeMonsters.map(async (monster) => {
            monster = PlayerStore.parsePlayer(monster)
            if(monster.outOfCombat) {
                let mmonster = this.managedMonsters.find((el) =>
                    el.user == monster.user &&
                    el.server == monster.server)
                await mmonster.destroy()
                await PlayerStore.removePlayerAction(monster)
                return mmonster
            } else {
                return null
            }
        }))

        deadMonsters = deadMonsters.filter((el) => el != null)

        deadMonsters.forEach((el) => {
            this.managedMonsters.splice(this.managedMonsters.indexOf(el),1)
        })

        if(deadMonsters.length > 0){
            logger.info(`Purged ${deadMonsters.length} dead monsters`)
        }
    }

    async spawnMonster(serverId){
        let UsedPuppets = await PlayerStore.state
            .find({$or:[{type:"PUPPET"},{type:"MONSTER"}]})
        let puppet = settings.puppets.find((el) => !UsedPuppets.find((up) => up.puppetId == el.id))

        if(!puppet)
            throw new Error("No puppet available")

        let monster = new Monster(puppet,serverId)

        let filler = 0
        let objective = Math.random()
        let total = settings.octoberEvent.monsters.reduce((acc,el) => acc+el.spawnChance,0)
        let monsterConfig = _.shuffle(settings.octoberEvent.monsters).find((el) => {
            filler += el.spawnChance / total
            return filler >= objective
        })
        Object.assign(monster,monsterConfig)
        monster.health = monster.maxHealth
        await monster.init()
        await PlayerStore.updatePlayerAction(monster)
        this.managedMonsters.push(monster)
        await monster.appear()
        return monster
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

        let item = _.shuffle(this.items).find((el) => {
            filler += el.dropChances / total
            return filler >= objective
        })

        let embed = item.toEmbed();
        embed.setFooter("Équipez vous de cet item avec ✅. Cela vous fera perdre votre ancien équipement.")

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

        let player = await PlayerStore.state.findOne({
            server: action.reaction.message.guild.id,
            user: user.id
        })

        if(!player){
            player = new PlayerStore.HumanPlayer(action.reaction.message.guild.id,user.id)
        }

        this.dropMessages.splice(this.dropMessages.indexOf(dropMessage),1)

        player.inventory = dropMessage.item

        await PlayerStore.updatePlayerAction(player)

        await action.reaction.message.channel.send(`${user} possède maintenant l'item **${dropMessage.item.name}**`)
    }

}

module.exports = new OctoberMiddleware()