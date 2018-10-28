const DatabaseEndpoint = require("../../HttpModule/DatabaseEndpoint")
const StatsDatabase = require("../databases/StatsDatabase")

module.exports = class StatsEndpoint extends DatabaseEndpoint {

    static get database(){
        return StatsDatabase
    }

    static get options(){
        return {
            read: true,
            write: false
        }
    }
    
}