const path = require("path")

module.exports = {
    token: "Your discord token here",
    dataDir: path.resolve(__dirname,"./data"),
    http: {
        port: 8080,
        address: "0.0.0.0",
        jwt: {
            secret: "Your incredibly strong personnal jwt secret",
            lifetime: 259200000
        }
    }
}