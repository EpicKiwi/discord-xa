const logger = require("../../../logger")

module.exports = class Provider {

	constructor(name,urlPattern){
		this.name = name
		this.urlPattern = urlPattern
	}

	init(){
		logger.info(`${this.name} music provider loaded`)
	}

	matchUrl(url){
		return url.match(this.urlPattern)
	}

	getStream(track){
		throw new Error(`The provider ${this.name} doesn't provide a stream system`)
	}

}