const fs = require("fs-extra")
const path = require("path")
const loadOrDefault = require("./loadordefault").sync

/**
 * Module de chargement et de stockage des paramètres globaux de l'application
 * @module settings
 */

module.exports = {

	/** Le chemin absolu vers le fichier de configuration,
	 * Si ce fichier n'existe pas, il ser crée sur la base du modèle par défaut
	 */
	settingsPath: path.resolve(__dirname,"../settings.json"),

	/** 
	 * Le chemin absolu vers le fichier de configuration par défaut
	 * permettant de créer le fichier de configuration s'il n'existe pas
	 */
    defaultSettingsPath: path.resolve(__dirname,"./defaults/settings.json"),

    /**
     * Charge le contenu des paramètres depuis le fichier de configuration
     * et les ajoute aux propriétés du module
     * @returns {settings} Le module settings
     */
	load() {
		const loadedSettings = loadOrDefault(this.settingsPath,this.defaultSettingsPath)
		for(let property in loadedSettings){
			if(!this[property]){
				this[property] = loadedSettings[property]
			}
		}
		return this
	}

}