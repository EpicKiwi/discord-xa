const Discord = require("discord.js")

exports.movieListRender = function(movieList,options){
	let response = ""
	if(!options)
		options = {}

	movieList.forEach((movie)=>{

		if(movie.title){
			let title = movie.title
			response += `**${title}**`
		} else if(movie.originalTitle) {
			let originalTitle = movie.originalTitle
			response += `**${originalTitle}**`
		} else {
			return
		}

		if(movie.castingShort && movie.castingShort.directors && !(options.directors === false)){
			let directors = movie.castingShort.directors.split(", ")
			response += ` de ${directors[0]}`
		}

		if(movie.release && movie.release.releaseDate && !(options.date === false)){
			let releaseDate = new Date(movie.release.releaseDate)
			response += ` sorti en *${releaseDate.getFullYear()}*`
		} else if (movie.productionYear && !(options.date === false)) {
			response += ` produit en *${movie.productionYear}*`
		}

		response += `\n`
	})

	return response

}

exports.fullMovieRender = function(movie){
	let response = {
		title: "",
		description: "",
		color: 4868682,
		fields: []
	}

	if(movie.title){
		let title = movie.title
        response.title += `${title}`
	} else if(movie.originalTitle) {
		let originalTitle = movie.originalTitle
        response.title += `${originalTitle}`
	}

	if(movie.movieType){
		let type = movie.movieType["$"]
		response.fields.push({
			name: "Type",
			value: type
		})
	}

	if(movie.genre){
		let genres = movie.genre
		genres = genres.map((genre) => genre["$"])
        response.fields[response.fields.length-1].value += " - "+genres.join(", ")
	}

	if(movie.synopsis){
        response.description += `${movie.synopsis.replace(/(<([^>]+)>)/ig,"")}`
	}else if(movie.synopsisShort){
        response.description += `${movie.synopsisShort.replace(/(<([^>]+)>)/ig,"")}`
	}

	if(response.description.length > 1024){
        response.description = response.description.substring(0,1021) + "..."
	}

	if(movie.release && movie.release.releaseDate){
		let releaseDate = new Date(movie.release.releaseDate)
        response.fields.push({
			name: "Année de sortie",
			value: `${releaseDate.getFullYear()}`
		})
	} else if (movie.productionYear) {
        response.fields.push({
            name: "Année de sortie",
            value: `${movie.productionYear}`
        })
	}

	if(movie.castMember){
		let directors = movie.castMember.filter((el)=>el.activity.code == 8002)
		let actors = movie.castMember.filter((el)=>el.activity.code == 8001)
		let directorsNames = directors.map((el)=>el.person.name)
		if(directorsNames.length > 1){
            response.fields.push({
                name: "Réalisateurs",
                value: `${directorsNames.join(", ")}`
            })
		} else if(directorsNames.length == 1){
            response.fields.push({
                name: "Réalisateur",
                value: `${directorsNames[0]}`
            })
		}
		if(actors.length > 0){
            actors.splice(10)
			let actorsRender = actors.map((actor)=>{
				if(actor.role)
					return `*${actor.person.name}* (${actor.role})`
				else
					return `${actor.person.name}`
			})
            response.fields.push({
                name: "Acteurs",
                value: `${actorsRender.join(" - ")}`
            })
		}
	}

	if(movie.poster){
		response.image = {url:movie.poster.href}
        response.thumbnail = {url:movie.poster.href}
	}

	response.url = movie.link[0].href

	return new Discord.RichEmbed(response);
}