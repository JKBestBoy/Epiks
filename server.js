const http = require('http');
const fs = require('fs');
const url = require('url');

// Créer un serveur HTTP
const server = http.createServer((req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.writeHead(204); // Répondre au pré-vol CORS
        return res.end();
    }

    const parsedUrl = url.parse(req.url, true);

    if (parsedUrl.pathname === '/messages' && req.method === 'GET') {
        // Récupérer les conversations et messages
        fs.readFile('./data/messages.json', 'utf-8', (err, data) => {
            if (err) {
                res.statusCode = 500;
                res.end('Erreur de lecture du fichier');
                return;
            }
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.end(data); // Retourne le contenu du fichier JSON
        });
    } else if (parsedUrl.pathname === '/messages' && req.method === 'POST') {
        // Ajouter un message
        let body = '';
        req.on('data', chunk => {
            body += chunk;
        });

        req.on('end', () => {
            if (!body) {
                res.statusCode = 400;
                res.end('Corps de la requête vide');
                return;
            }

            try {
                const { id, message } = JSON.parse(body);

                fs.readFile('./data/messages.json', 'utf-8', (err, data) => {
                    if (err) {
                        res.statusCode = 500;
                        res.end('Erreur de lecture du fichier');
                        return;
                    }

                    const jsonData = JSON.parse(data);
                    const conversation = jsonData.conversations.find(c => c.id === id);
                    if (!conversation) {
                        res.statusCode = 404;
                        res.end('Conversation non trouvée');
                        return;
                    }

                    const newMessage = {
                        sender: message.sender || "You",
                        text: message.text,
                        time: new Date().toLocaleTimeString()
                    };

                    conversation.messages.push(newMessage);

                    fs.writeFile('./data/messages.json', JSON.stringify(jsonData, null, 2), (err) => {
                        if (err) {
                            res.statusCode = 500;
                            res.end('Erreur lors de l\'ajout du message');
                            return;
                        }

                        res.statusCode = 201;
                        res.setHeader('Content-Type', 'application/json');
                        res.end(JSON.stringify({ message: 'Message ajouté' }));
                    });
                });
            } catch (e) {
                res.statusCode = 400;
                res.end('Erreur de format JSON');
            }
        });
    } else {
        res.statusCode = 404;
        res.end('Page non trouvée');
    }
});

server.listen(3000, () => {
    console.log('Serveur en écoute sur http://localhost:3000');
});
