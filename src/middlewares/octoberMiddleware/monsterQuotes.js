module.exports = {quotes:[
        "Arghh",
        "Graawhght",
        "Arrrgh",
        "Grawwwrrrrgk",
        "Hawwwrrrrgh",
        "Argh gra hark graaah",
        "Gharwwwggrrh",
        "Arghrrrraawh",
        "Grraaaawwwh",
        "Ark grak garah kra",
        "Paaarrwwwhh",
        "GaaarwwwhhaAAAARgh",
        "Agrraah",
        "grabrawk",
        "Kragarhvra"
    ],
    endings: [
        "...",
        "?",
        "??",
        "?!",
        "!!!",
        "!",
        "?!...",
        "!!"
    ],
    generate(){
        let quote = this.quotes[Math.floor(this.quotes.length*Math.random())]
        let ending = this.endings[Math.floor(this.endings.length*Math.random())]
        return `${quote} ${ending}`
    }
}