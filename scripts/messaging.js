document.addEventListener('DOMContentLoaded', () => {
    const conversationsList = document.querySelector('.conversations-list ul');
    const activeChatSection = document.getElementById('active-chat');
    const noConversationMessage = document.getElementById('no-conversation');
    const activeUsername = document.getElementById('active-username');
    const activeProfilePic = document.getElementById('active-profile-pic');
    const activeMessages = document.getElementById('active-messages');

    // Chargement des conversations depuis le fichier JSON
    fetch('data/messages.json')
        .then(response => response.json())
        .then(data => {
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

        // Extraction du time du dernier message
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
        activeChatSection.classList.add('visible');
        noConversationMessage.style.display = 'none';  // Masquer le message de sélection

        // Mettre à jour le nom et l'image dans le header de chat
        activeUsername.textContent = conversation.username;
        activeProfilePic.src = conversation.profile_pic;

        // Vider les anciens messages et afficher ceux de la conversation active
        activeMessages.innerHTML = ''; 
        conversation.messages.forEach(msg => {
            const messageDiv = document.createElement('div');
            messageDiv.classList.add('message');
            messageDiv.classList.add(msg.sender === "You" ? "sent" : "received");
            messageDiv.innerHTML = `
                <p class="message-text">${msg.text}</p>
                <p class="message-time">${msg.time}</p>
            `;
            activeMessages.appendChild(messageDiv);
        });

        activeMessages.scrollTop = activeMessages.scrollHeight;  // Faire défiler vers le bas
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

            // Envoyer le message au serveur (optionnel, selon l'implémentation)
            sendMessageToServer(message);
        }
    });

    // Fonction pour envoyer le message au serveur
    function sendMessageToServer(message) {
        const activeConversationId = document.querySelector('.active-chat').dataset.id;

        fetch('http://localhost:3000/messages', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: activeConversationId, message: message })
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
