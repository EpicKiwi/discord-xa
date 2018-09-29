const CollectionStore = require("./CollectionStore")

const PlayerType = {
    HUMAN: "HUMAN",
    PUPPET: "PUPPET",
    UNKNOWN: "UNKNOWN"
}

class Player {

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
        }
        Object.assign(player,rawPlayer)
        return player;
    }

    async updatePlayerAction(player){

        let inventory = null
        if(player.inventory){
            inventory = {
                name: player.inventory.name,
                lifetime: player.inventory.lifetime
            }
        }

        await this.insertOrUpdate({
            server: player.server,
            user: player.user
        },{
            type: player.type,
            maxHealth: player.maxHealth,
            health: player.health,
            inventory
        })
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