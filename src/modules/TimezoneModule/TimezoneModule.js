const Module = require("../../core/Module")
const TimeCommand = require("./commands/TimeCommand")
const TimezoneDatabase = require("./databases/TimezoneDatabase")
const SetTimezoneCommand = require("./commands/SetTimezoneCommand")

module.exports = class TimezoneModule extends Module {

    static get moduleName(){return "Timezone module"}

    static get description(){return "A command module providing timezone utilities"}

    static get provides(){
        return [
            TimeCommand,
            TimezoneDatabase,
            SetTimezoneCommand,
        ]
    }

}