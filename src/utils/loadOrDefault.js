const fs = require("fs-extra")

/**
 * Module permettant de charger le contenu d'un fichier JSON s'il existe
 * S'il n'existe pas le fichier JSOn est copié depuis un fichier par défaut puis chargé
 * @module lib/loadOrDefault
 */

module.exports = {

	/**
	 * Charge de manière synchrone un fcihier JSON s'il existe
	 * S'il n'existe pas, le fichier par défaut est copié puis chargé
	 * @param {string} path - Le chemin du fichier a charger
	 * @param {string} defaultPath - Le chemin du fichier par defaut
	 * @returns {object} Le contenu parsé du fichier JSON
	 */
	sync(path,defaultPath){
		try{
			fs.accessSync(path)
		} catch(e) {
			if(e.code == "ENOENT"){
				fs.copySync(defaultPath,path)
			} else {
				throw e
			}
		}
		return JSON.parse(fs.readFileSync(path))
	}
}