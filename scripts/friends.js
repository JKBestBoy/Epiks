document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('search-input');
    const friendsList = document.getElementById('friends-list');
    const friends = friendsList.getElementsByClassName('friend');

    // Fonction de filtrage pour la recherche
    searchInput.addEventListener('input', () => {
        const searchTerm = searchInput.value.toLowerCase();

        Array.from(friends).forEach(friend => {
            const friendName = friend.querySelector('.friend-name').textContent.toLowerCase();
            if (friendName.includes(searchTerm)) {
                friend.style.display = 'block'; // Afficher l'ami
            } else {
                friend.style.display = 'none'; // Cacher l'ami
            }
        });
    });

    // Drag and Drop
    let draggedItem = null;

    // Commencer à draguer
    friendsList.addEventListener('dragstart', (e) => {
        if (e.target.classList.contains('friend')) {
            draggedItem = e.target;
            e.target.classList.add('dragging');
            setTimeout(() => {
                e.target.style.display = 'none'; // Cacher l'élément pendant le drag
            }, 0);
        }
    });

    // Fin du drag
    friendsList.addEventListener('dragend', (e) => {
        if (e.target.classList.contains('friend')) {
            e.target.classList.remove('dragging');
            setTimeout(() => {
                e.target.style.display = ''; // Réafficher l'élément après le drag
                draggedItem = null;
            }, 0);
        }
    });

    // Autoriser le drop
    friendsList.addEventListener('dragover', (e) => {
        e.preventDefault();
        const afterElement = getDragAfterElement(friendsList, e.clientY);
        if (afterElement == null) {
            friendsList.appendChild(draggedItem); // Ajouter à la fin de la liste
        } else {
            friendsList.insertBefore(draggedItem, afterElement);
        }
    });

    // Déterminer l'élément suivant le point de drop
    const getDragAfterElement = (container, y) => {
        const draggableElements = [...container.querySelectorAll('.friend:not(.dragging)')];

        return draggableElements.reduce((closest, child) => {
            const box = child.getBoundingClientRect();
            const offset = y - box.top - box.height / 2;
            if (offset < 0 && offset > closest.offset) {
                return { offset: offset, element: child };
            } else {
                return closest;
            }
        }, { offset: Number.NEGATIVE_INFINITY }).element;
    };
});
