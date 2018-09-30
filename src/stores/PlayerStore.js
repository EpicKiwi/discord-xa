const CollectionStore = require("./CollectionStore")
let Monster;
const settings = require("../settings")

const PlayerType = {
    HUMAN: "HUMAN",
    PUPPET: "PUPPET",
    MONSTER: "MONSTER",
    UNKNOWN: "UNKNOWN"
}

class Player {

    get excludedProperties(){
        return []
    }

    constructor(serverId,userId,maxHealth=100){
        this.server = serverId
        this.user = userId
        this.type = PlayerType.UNKNOWN
        this.maxHealth = maxHealth
        this.health = this.maxHealth
        this.inventory = null
    }

    get outOfCombat(){
        return this.health <= 0
    }

}

class HumanPlayer extends Player {
    constructor(serverId,userId,maxHealth=100) {
        super(serverId,userId,maxHealth);
        this.type = PlayerType.HUMAN
    }

    get outOfCombat(){
        return this.health <= 20
    }
}

class PuppetPlayer extends Player {
    constructor(puppetId,serverId,userId,maxHealth=100) {
        super(serverId,userId,maxHealth);
        this.type = PlayerType.PUPPET
        this.puppetId = puppetId
    }
}

class PlayerStore extends CollectionStore {

    constructor(){
        super()
    }

    parsePlayer(rawPlayer){
        let player = null
        switch(rawPlayer.type){
            case PlayerType.HUMAN:
                player = new HumanPlayer(rawPlayer.server,rawPlayer.user,rawPlayer.maxHealth)
                break;
            case PlayerType.PUPPET:
                player = new PuppetPlayer(rawPlayer.puppetId,rawPlayer.server,rawPlayer.user,rawPlayer.maxHealth)
                break;
            case PlayerType.MONSTER:
                if(!Monster)
                    Monster = require("../middlewares/octoberMiddleware/Monster")
                let puppet = settings.puppets.find((el) => rawPlayer.puppetId == el.id)
                player = new Monster(puppet,rawPlayer.serverId)
        }
        Object.assign(player,rawPlayer)
        return player;
    }

    async updatePlayerAction(player){

        let updateObject = {}
        let persistedKeys = Object.keys(player)

        if(player.excludedProperties)
            persistedKeys = persistedKeys
                .filter((el) => player.excludedProperties.indexOf(el) == -1)

        persistedKeys.forEach((key) => {
            if(key == "inventory"){
                if(player[key]) {
                    updateObject.inventory = {
                        name: player.inventory.name,
                        lifetime: player.inventory.lifetime
                    }
                } else {
                    updateObject[key] = null
                }
            } else {
                updateObject[key] = player[key]
            }
        })

        await this.insertOrUpdate({
            server: player.server,
            user: player.user
        },updateObject)
    }

    async removePlayerAction(player){
        await this.state.remove({user:player.user,server:player.server})
    }

    async healPlayerAction(user,server,amount){
        let player = await this.state.findOne({user,server})
        if(!player)
            return null

        if(player.health < player.maxHealth){
            player.health = Math.min(player.maxHealth,player.health+amount)
            await this.updatePlayerAction(player)
        }
    }

}

module.exports = new PlayerStore()
module.exports.HumanPlayer = HumanPlayer
module.exports.PuppetPlayer = PuppetPlayer