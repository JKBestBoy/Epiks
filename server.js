const http = require('http'); // Pour créer un serveur HTTP
const fs = require('fs'); // Pour lire et écrire dans des fichiers
const path = require('path'); // Pour manipuler les chemins de fichiers
const url = require('url'); // Pour parser les URLs

// Créer un serveur HTTP
const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true); // Parser l'URL de la requête
    const method = req.method; // Récupérer la méthode HTTP (GET, POST, etc.)

    // Gérer la route /messages pour envoyer un message
    if (parsedUrl.pathname === '/messages' && method === 'POST') {
        let body = '';

        // Récupérer les données envoyées dans le corps de la requête
        req.on('data', chunk => {
            body += chunk;
        });

        // Quand la requête est terminée
        req.on('end', () => {
            console.log('Corps de la requête reçu:', body); // Afficher ce que le serveur reçoit

            if (!body) {
                res.statusCode = 400; // Mauvaise requête
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ error: 'Corps de la requête vide' }));
                return;
            }

            // Essayer de parser le JSON
            try {
                const { id, message } = JSON.parse(body); // Récupérer l'ID de la conversation et le message
                console.log('Données JSON parsées:', { id, message });  // Vérifier les données reçues

                // Lire le fichier JSON existant
                fs.readFile('./data/messages.json', 'utf-8', (err, data) => {
                    if (err) {
                        res.statusCode = 500;
                        res.end('Erreur de lecture du fichier');
                        return;
                    }

                    const jsonData = JSON.parse(data); // Parse les données existantes

                    // Trouver la conversation avec l'ID correspondant
                    const conversation = jsonData.conversations.find(c => c.id === id);
                    if (!conversation) {
                        res.statusCode = 404;
                        res.end('Conversation non trouvée');
                        return;
                    }

                    // Ajouter le nouveau message dans la conversation
                    const newMessage = {
                        sender: message.sender || "You", // Par défaut, l'expéditeur est "You"
                        text: message.text,
                        time: new Date().toLocaleTimeString() // L'heure du message
                    };

                    conversation.messages.push(newMessage); // Ajouter le message à la conversation

                    // Écrire les messages mis à jour dans le fichier JSON
                    fs.writeFile('./data/messages.json', JSON.stringify(jsonData, null, 2), (err) => {
                        if (err) {
                            res.statusCode = 500;
                            res.end('Erreur lors de l\'ajout du message');
                            return;
                        }

                        // Répondre avec un message de succès
                        res.statusCode = 201;
                        res.setHeader('Content-Type', 'application/json');
                        res.end(JSON.stringify({ message: 'Message ajouté' }));
                    });
                });
            } catch (e) {
                // Si une erreur survient lors du parsing du JSON
                res.statusCode = 400;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ error: 'Erreur de format JSON' }));
            }
        });

    } else if (parsedUrl.pathname === '/messages' && method === 'GET') {
        // Gérer la requête GET pour récupérer toutes les conversations avec les messages
        fs.readFile('./data/messages.json', 'utf-8', (err, data) => {
            if (err) {
                res.statusCode = 500;
                res.end('Erreur de lecture du fichier');
                return;
            }

            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.end(data); // Renvoie les messages et conversations en JSON
        });

    } else {
        // Si la route n'est pas reconnue, renvoyer une erreur 404
        res.statusCode = 404;
        res.end('Page non trouvée');
    }
});

// Lancer le serveur
server.listen(3000, () => {
    console.log('Serveur en écoute sur http://localhost:3000');
});
