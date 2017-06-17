module.exports = class Track {

	constructor(url,provider){
		this.url = url
		this.provider = provider
	}

	getStream(){
		return this.provider.getStream(this)
	}

}