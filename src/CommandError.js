module.exports = class CommandError extends Error {

	constructor(message){
		super(message)
		this.displayMessage = true;
	}

}