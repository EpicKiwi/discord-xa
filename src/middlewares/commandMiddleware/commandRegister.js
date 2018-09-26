module.exports = {
    commands: [
        require("./commands/movies/moviesNewsCommand"),
        require("./commands/movies/moviesDetailsCommand"),
        require("./commands/PingCommand"),
        require("./commands/ExecCommand"),
        require("./commands/maths/computeCommand"),
        require("./commands/maths/renderCommand"),
        require("./commands/FunCommand"),
        require("../octoberMiddleware/ItemCommand"),
        require("../octoberMiddleware/InventoryCommand"),
        require("../octoberMiddleware/UseCommand")
    ]
}