const express = require('express');
const bodyParser = require('body-parser');
const app = express();
// const router = require('./route/router');
const port = process.env || 3000;

// Gestion des fichiers statiques
app.use(express.static('public'));

// Utilisation du middleware body-parser pour traiter les données du formulaire
app.use(bodyParser.urlencoded({ extended: true }));

// Gestion des routes
app.use((req, res) => {
    res.send('Dev Branch!')
    // router.handleRequest(req, res);
});

// Démarrer le serveur
app.listen(port, () => {
    console.log(`Serveur en écoute sur http://localhost:${port}`);
});
