const LogMiddleware = require("./middlewares/LogMiddleware")
const CommandMiddleware = require("./middlewares/commandMiddleware/CommandMiddleware")

module.exports = {
    middlewares: [
        new CommandMiddleware(),
        new LogMiddleware()
    ]
}