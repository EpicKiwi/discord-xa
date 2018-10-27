const Database = require("../../../core/Database")

module.exports = class TimezoneDatabase extends Database {

    static get defaultValues(){
        return {
            "server": "UTC" 
        }
    }

}