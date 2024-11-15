document.addEventListener('DOMContentLoaded', () => {
    const conversationsList = document.querySelector('.conversations-list ul');
    const activeChatSection = document.getElementById('active-chat');
    const noConversationMessage = document.getElementById('no-conversation');
    const activeUsername = document.getElementById('active-username');
    const activeProfilePic = document.getElementById('active-profile-pic');
    const activeMessages = document.getElementById('active-messages');

        // Chargement des conversations depuis le serveur Node.js
    fetch('http://localhost:3000/messages') // Pointing to your server
    .then(response => response.json())
    .then(data => {
        data.conversations.forEach(conversation => {
            const conversationElement = createConversationElement(conversation);
            conversationsList.appendChild(conversationElement);
            
            // Attacher l'événement de clic pour ouvrir la conversation
            conversationElement.addEventListener('click', () => openChat(conversation));
        });
    })
    .catch(error => console.error('Erreur de chargement des conversations :', error));

        // Fonction pour créer un élément de conversation
        function createConversationElement(conversation) {
            const li = document.createElement('li');
            li.classList.add('conversation');
            li.dataset.id = conversation.id;

            const timeAgo = conversation.time || "Récemment"; // Si pas d'heure, afficher "Récemment"

            li.innerHTML = `
                <div class="avatar"><img src="${conversation.profile_pic}" alt="${conversation.username}"></div>
                <div class="conversation-info">
                    <p class="username">${conversation.username}</p>
                    <p class="last-message">${conversation.last_message}</p>
                </div>
                <div class="conversation-time">${timeAgo}</div> <!-- Affichage de l'heure du dernier message -->
            `;

            li.addEventListener('click', () => openChat(conversation));

            return li;
        }

        // Fonction pour ouvrir la conversation active
        function openChat(conversation) {
            console.log('openChat appelé pour la conversation :', conversation);
        
            activeChatSection.classList.add('visible');
            noConversationMessage.style.display = 'none';
        
            activeChatSection.dataset.id = conversation.id;
            console.log('ID de la conversation après mise à jour dans openChat:', activeChatSection.dataset.id);
        
            // Mise à jour des informations de l'utilisateur actif
            activeUsername.textContent = conversation.username;
            activeProfilePic.src = conversation.profile_pic;
        
            // Ajout des messages
            activeMessages.innerHTML = '';
            conversation.messages.forEach(msg => {
                const messageDiv = document.createElement('div');
                messageDiv.classList.add('message', msg.sender === "You" ? "sent" : "received");
                messageDiv.innerHTML = `
                    <p class="message-text">${msg.text}</p>
                    <p class="message-time">${msg.time}</p>
                `;
                activeMessages.appendChild(messageDiv);
            });
        
            activeMessages.scrollTop = activeMessages.scrollHeight;
        }
        
        
        
        

        // Fonction pour envoyer un message
        const sendButton = document.querySelector('#send-button');
        sendButton.addEventListener('click', () => {
            const input = document.querySelector('#message-input');
            const messageText = input.value.trim();

            if (messageText) {
                const message = {
                    sender: "You",
                    text: messageText,
                    time: new Date().toLocaleTimeString()
                };

                // Ajouter le message à la conversation active
                const messageDiv = document.createElement('div');
                messageDiv.classList.add('message', 'sent');
                messageDiv.innerHTML = `<p class="message-text">${messageText}</p><p class="message-time">${message.time}</p>`;
                activeMessages.appendChild(messageDiv);

                input.value = '';
                activeMessages.scrollTop = activeMessages.scrollHeight;  // Faire défiler vers le bas

                // Envoyer le message au serveur
                sendMessageToServer(message);
            }
        });

        // Fonction pour envoyer un message au serveur
        function sendMessageToServer(message) {
            const activeChatSection = document.querySelector('.active-chat');
        
            // Vérifier si .active-chat est trouvé
            if (!activeChatSection) {
                console.error('Aucune conversation active trouvée dans le DOM');
                return;
            }
        
            // Vérifier si l’attribut data-id est défini
            const activeConversationId = activeChatSection.dataset.id;
            if (!activeConversationId) {
                console.error('L\'ID de la conversation active est introuvable', activeChatSection);
                return;
            }
        
            console.log('ID de la conversation active trouvé :', activeConversationId);
        
            const messageData = {
                id: parseInt(activeConversationId, 10),
                message: message
            };
        
            // Envoi du message au serveur
            fetch('http://localhost:3000/messages', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(messageData)
            })
            .then(response => response.json())
            .then(data => {
                console.log('Message ajouté au serveur :', data);
            })
            .catch(error => {
                console.error('Erreur lors de l\'envoi du message au serveur :', error);
            });
        }

    
});

