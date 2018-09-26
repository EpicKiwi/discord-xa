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

}

class HumanPlayer extends Player {
    constructor(serverId,userId,maxHealth=100) {
        super(serverId,userId,maxHealth);
        this.type = PlayerType.HUMAN
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

    async updatePlayer(player){

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

}

module.exports = new PlayerStore()
module.exports.HumanPlayer = HumanPlayer
module.exports.PuppetPlayer = PuppetPlayer