const Store = require("./Store")
const Database = require('../Database')

class CollectionStore extends Store {

    constructor() {
        super()
        this.state = Database.createCollection("store",this.constructor.name.toLowerCase())
    }

    async insertOrUpdate(selection,set){
        let doc = await this.state.findOne(selection)
        if(!doc){
            await this.state.insert(selection)
        }
        await this.state.update(selection,{$set: set})
    }

}

module.exports = CollectionStore