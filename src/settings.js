const fs = require("fs-extra")
const path = require("path")
const loadOrDefault = require("./utils/loadOrDefault").sync

class Settings {

	constructor(){
        this.settingsPath = path.resolve(__dirname,"../settings.json")
        this.defaultSettingsPath = path.resolve(__dirname,"./defaults/settings.json")
	}

	load(){
        const loadedSettings = loadOrDefault(this.settingsPath,this.defaultSettingsPath)
        for(let property in loadedSettings){
            if(!this[property]){
                this[property] = loadedSettings[property]
            }
        }
        return this
	}

}

module.exports = new Settings()