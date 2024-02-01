const express = require('express')
const app = express()
const router = require('./route/router');

app.use(express.static('public'));

// Utilisation du middleware body-parser pour traiter les données du formulaire
app.use(bodyParser.urlencoded({ extended: true }));

// Gestion des routes
app.use((req, res) => {
    router.handleRequest(req, res);
});

app.listen(process.env.PORT || 3000)
