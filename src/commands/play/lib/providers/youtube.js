const Provider = require("../Provider")
const ytdl = require("ytdl-core")

const pro = new Provider("Youtube",/(youtube\.com\/watch\?v=|youtu\.be)/)

pro.getStream = (track) => ytdl(track.url,{filter:"audioonly"})

module.exports = pro