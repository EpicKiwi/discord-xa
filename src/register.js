const LogMiddleware = require("./middlewares/LogMiddleware")
const CommandMiddleware = require("./middlewares/commandMiddleware/CommandMiddleware")
const PinMiddleware = require("./middlewares/PinMiddleware")

module.exports = {
    middlewares: [
        new CommandMiddleware(),
        //new LogMiddleware(),
        new PinMiddleware(),
        require('./middlewares/octoberMiddleware/OctoberMiddleware')
    ]
}