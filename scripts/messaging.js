document.addEventListener('DOMContentLoaded', () => {
    // Chargement des conversations depuis le fichier JSON
    fetch('data/messages.json')
        .then(response => response.json())
        .then(data => {
            const conversationsList = document.querySelector('.conversations-list ul');
            data.conversations.forEach(conversation => {
                const conversationElement = createConversationElement(conversation);
                conversationsList.appendChild(conversationElement);
            });
        })
        .catch(error => console.error('Erreur de chargement des conversations :', error));

    // Fonction pour créer un élément de conversation
    function createConversationElement(conversation) {
        const li = document.createElement('li');
        li.classList.add('conversation');
        li.dataset.id = conversation.id;

        li.innerHTML = `
            <div class="avatar"><img src="${conversation.profile_pic}" alt="${conversation.username}"></div>
            <div class="conversation-info">
                <p class="username">${conversation.username}</p>
                <p class="last-message">${conversation.last_message}</p>
            </div>
        `;

        li.addEventListener('click', () => openChat(conversation));

        return li;
    }

    // Fonction pour ouvrir la conversation active
    function openChat(conversation) {
        const chatHeader = document.querySelector('.chat-header h3');
        chatHeader.textContent = conversation.username;

        const messagesContainer = document.querySelector('.messages');
        messagesContainer.innerHTML = ''; // Clear previous messages

        // Afficher les messages de la conversation active
        conversation.messages.forEach(msg => {
            const messageDiv = document.createElement('div');
            messageDiv.classList.add('message');
            messageDiv.classList.add(msg.sender === "You" ? "sent" : "received");
            messageDiv.innerHTML = `
                <p class="message-text">${msg.text}</p>
                <p class="message-time">${msg.time}</p>
            `;
            messagesContainer.appendChild(messageDiv);
        });

        // Lorsque l'on ouvre la conversation, s'assurer que l'on défile vers le bas
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    // Sélectionner le bouton "Envoyer" par son ID
    const sendButton = document.querySelector('#send-button');  // Utilisation de l'ID "send-button"
    
    sendButton.addEventListener('click', () => {
        const input = document.querySelector('#message-input');  // Sélectionner le textarea par son ID "message-input"
        const messageText = input.value.trim();
        
        if (messageText) {
            const messagesContainer = document.querySelector('.messages');
            const message = {
                sender: "You",
                text: messageText,
                time: new Date().toLocaleTimeString() // L'heure du message
            };

            // Ajouter le message envoyé à la conversation active
            const messageDiv = document.createElement('div');
            messageDiv.classList.add('message', 'sent');
            messageDiv.innerHTML = `<p class="message-text">${messageText}</p><p class="message-time">${message.time}</p>`;
            messagesContainer.appendChild(messageDiv);
            
            // Réinitialiser le champ de saisie
            input.value = '';
            messagesContainer.scrollTop = messagesContainer.scrollHeight; // Faire défiler vers le bas

            // Vous pouvez aussi envoyer ce message au serveur pour le stocker dans le fichier JSON
            sendMessageToServer(message);
        }
    });

    // Fonction pour envoyer le message au serveur et mettre à jour le fichier JSON
    function sendMessageToServer(message) {
        const activeConversationId = document.querySelector('.active-chat').dataset.id;
        
        fetch('http://localhost:3000/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: activeConversationId,
                message: message
            })
        })
        .then(response => response.json())
        .then(data => {
            console.log('Message ajouté au serveur:', data);
        })
        .catch(error => {
            console.error('Erreur lors de l\'ajout du message au serveur:', error);
        });
    }
});
