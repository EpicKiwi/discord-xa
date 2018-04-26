const LogMiddleware = require("./middlewares/LogMiddleware")
const CommandMiddleware = require("./middlewares/CommandMiddleware")

module.exports = {
    middlewares: [
        new CommandMiddleware(),
        new LogMiddleware()
    ]
}