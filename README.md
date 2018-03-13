# Xa

Xa est un bot Discord fonctionnant en ligne de commande et ayant pour but de proposer des services généraux.

## Fonctionnalités

* Une archithecture de **commandes** déclanchées avec la commande `>`
* L'affichage des **films à l'affiche** avec la commande `movies` ou `movies new`
* La **recherche de films** avec la commande `movies search`
* Les **détails d'un film** avec la commande `movies details`
* Le **renvoie d'un message** générique avec la commande `ping`
* L'**affichage de l'aide** des commandes avec la commande `help`
* La **lecture** d'une URL youtube avec la commande `play` ou `play music`
* La commande du bot à distance à l'aide d'une API REST selon le protocol **XIO**

### Todo list

* [ ] Revoir le système de lecture de musique
  * [ ] Faire le lien entre un Titre Spotify et une vidéo Youtube pour lire des URL spotify
  * [ ] Ajouter un système *autopilot* pour ajouter des vidéos a la playlist quand celle ci est vide. Les vidéos sont choisis parmis les vidéos proposés par Youtube ou Spotify
  * [ ] Ajouter la possibilité d'enregistrer des playlists
  * [ ] Ajouter un mode *ambiance* pour jouer de la misuqe a faible volume pour qu'on puisse s'entendre
  * [ ] Faire en sorte que Xa se connecte au channel vocal de l'utilisateur qui initie la playlist et non au premier chan vocal du serveur
  * [ ] Pouvoir stopper complètement la playlist en cours
* [ ] Permettre à xa de se mettre à jour par une commande
* [ ] Mettre à disposition un environnement d'éxécution de code sécurisé
  * [ ] Executer du code JavaScript
  * [ ] Enregistrer des fonctions Javascript pour les définir comme commandes
* [ ] Ajouter des exemples dans l'aide
* [ ] Ajouter un système de middleware
* [ ] Créer un middleware permettant d'épingler un message sur une channel différent pour libèrer l'espace d'épinglage
  * [ ] Utiliser la reaction 📌 pour épingler les messages
  * [ ] Au moins deux personnes doivent ajouter cette réaction pour que le message soit épingler
* [ ] Créer un middleware de stats
  * [ ] Le nombre de messages postés
  * [ ] Le temps connecté
  * [ ] Le nombre de commandes éxécutés
  * [ ] Le nombre de reactions donnés
  * [ ] Le nombre de reaction par type
  * [ ] Le temps passé sur les channels vocaux
* [ ] Créer un module de configuration server-wide
* [ ] Recupèrer et afficher des données depuis un service d'open data
* [ ] Ajouter une commande de reminder permettant d'éxécuter une autre commande dans un temps donné ou à interval régulier
* [ ] Commande pour afficher l'image of the day Nasa et Bing
* [ ] Reunir toutes les chaines de carractères dans un même fichier pour pourvoir facilement corriger et traduir
    
    
