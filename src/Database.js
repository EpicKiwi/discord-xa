const Nedb = require("nedb-promise")
const settings = require("./settings")
const path = require("path")
const logger = require("./logger")

class Database {

    constructor(){
        this.collections = {}
    }

    createCollection(middlewareName,collectionName){
        middlewareName = middlewareName.toLocaleString()
        if(!this.collections[middlewareName]){
            this.collections[middlewareName] = {}
        } else if(this.collections[middlewareName][collectionName]) return
        let collectionPath = this.getCollectionPath(middlewareName,collectionName)
        this.collections[middlewareName][collectionName] = new Nedb({filename: collectionPath, autoload: true})
        logger.info(`Created collection ${collectionPath}`)
    }

    getCollectionPath(middleware,name){
        return path.resolve(`${__dirname}/../${settings["data-directory"]}/${middleware.toLowerCase()}-${name}.db`)
    }

}

module.exports = new Database()