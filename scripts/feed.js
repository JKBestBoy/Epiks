document.addEventListener("DOMContentLoaded", () => {
    fetch("data/posts.json")
        .then(response => response.json())
        .then(posts => {
            const feed = document.getElementById("feed");
            posts.forEach(post => {
                const postElement = createPostElement(post);
                feed.appendChild(postElement);
            });
        })
        .catch(error => console.error("Erreur de chargement des posts :", error));
});

function createPostElement(post) {
    const postDiv = document.createElement("div");
    postDiv.classList.add("post");

    // Header du post avec l'utilisateur
    const postHeader = document.createElement("div");
    postHeader.classList.add("post-header");

    const profileImg = document.createElement("img");
    profileImg.src = post.profile_pic;
    profileImg.alt = "Profile pic";
    profileImg.classList.add("profile-pic");

    const username = document.createElement("span");
    username.classList.add("username");
    username.textContent = post.username;

    postHeader.appendChild(profileImg);
    postHeader.appendChild(username);
    postDiv.appendChild(postHeader);

    // Image du post
    if (post.image) {
        const img = document.createElement("img");
        img.src = post.image;
        img.alt = "Post image";
        img.classList.add("post-image");

        img.addEventListener("click", (e) => openModal(img.src, e));

        postDiv.appendChild(img);
    }

    // Texte du post
    const textDiv = document.createElement("div");
    textDiv.classList.add("text");
    textDiv.textContent = post.text;
    postDiv.appendChild(textDiv);

    // Footer du post avec les réactions
    const reactionsDiv = document.createElement("div");
    reactionsDiv.classList.add("reactions");

    const likeButton = createReactionButton("fa-thin fa-thumbs-up", "like", post.id);
    const dislikeButton = createReactionButton("fa-thin fa-thumbs-down", "dislike", post.id);
    const loveButton = createReactionButton("fa-thin fa-heart", "love", post.id);

    reactionsDiv.appendChild(likeButton);
    reactionsDiv.appendChild(dislikeButton);
    reactionsDiv.appendChild(loveButton);

    postDiv.appendChild(reactionsDiv);

    // Section des commentaires
    const commentsSection = document.createElement("div");
    commentsSection.classList.add("comments");

    post.comments.forEach(comment => {
        const commentDiv = createCommentElement(comment);
        commentsSection.appendChild(commentDiv);
    });

    // Container pour le champ de texte et le bouton "Publier"
    const commentContainer = document.createElement("div");
    commentContainer.classList.add("comment-container");

    const commentInput = document.createElement("textarea");
    commentInput.placeholder = "Écrire un commentaire...";
    commentInput.classList.add("comment-input");

    const commentSubmitButton = document.createElement("button");
    commentSubmitButton.textContent = "Publier";
    commentSubmitButton.classList.add("comment-submit-button");
    commentSubmitButton.disabled = true;

    commentInput.addEventListener("input", () => {
        if (commentInput.value.trim().length > 0) {
            commentSubmitButton.disabled = false;
            commentSubmitButton.classList.add("active");
        } else {
            commentSubmitButton.disabled = true;
            commentSubmitButton.classList.remove("active");
        }
    });

    commentSubmitButton.addEventListener("click", () => addComment(post.id, commentInput.value, commentsSection));

    commentContainer.appendChild(commentInput);
    commentContainer.appendChild(commentSubmitButton);

    postDiv.appendChild(commentsSection);
    postDiv.appendChild(commentContainer);

    return postDiv;
}

function createReactionButton(iconClass, reactionType, postId) {
    const button = document.createElement("button");
    button.classList.add("reaction-button");
    button.innerHTML = `<i class="fa ${iconClass}"></i>`;  // Utiliser l'icône FontAwesome Thin
    button.addEventListener("click", (e) => handleReaction(postId, reactionType, button, e));
    return button;
}

function handleReaction(postId, reactionType, button, event) {
    const icon = button.querySelector("i");
    if (icon) {
        icon.classList.add("heartbeat");
        setTimeout(() => {
            icon.classList.remove("heartbeat");
        }, 400);

        // Créer des particules à chaque clic, et s'assurer qu'elles sont positionnées autour du bouton
        createParticles(button, event);
    }
}

function createParticles(button, event) {
    const rect = button.getBoundingClientRect();  // Récupère les coordonnées et les dimensions du bouton

    // Ajouter le défilement (scroll) à la position de l'élément
    const offsetY = window.scrollY || document.documentElement.scrollTop;

    const centerX = rect.left + rect.width / 2;  // Calculer le centre du bouton
    const centerY = rect.top + rect.height / 2 + offsetY;  // Ajuster en tenant compte du défilement

    const numberOfParticles = 30;  // Nombre de particules à créer

    // Créer un élément <style> pour ajouter des règles CSS dynamiquement
    let style = document.querySelector("style");

    if (!style) {
        style = document.createElement("style");
        document.head.appendChild(style);  // Ajouter le style au <head>
    }

    // Ajouter des keyframes pour l'animation des particules
    let keyframes = "";
    for (let i = 0; i < numberOfParticles; i++) {
        const angle = Math.random() * 2 * Math.PI;
        const distance = Math.random() * 50 + 20;  // Distance aléatoire entre 20px et 50px
        const x = distance * Math.cos(angle);  // Déplacement horizontal
        const y = distance * Math.sin(angle);  // Déplacement vertical

        keyframes += `@keyframes particle-animation-${i} {
            0% {
                transform: translate(0, 0) scale(1);
                opacity: 1;
            }
            100% {
                transform: translate(${x}px, ${y}px) scale(0);
                opacity: 0;
            }
        }`;
    }

    // Insérer les règles CSS dynamiques dans le <style>
    style.innerHTML += keyframes;

    // Créer et animer les particules
    for (let i = 0; i < numberOfParticles; i++) {
        const particle = document.createElement("div");
        particle.classList.add("particle");

        // Placer la particule initialement au centre du bouton
        particle.style.left = `${centerX - 4}px`;
        particle.style.top = `${centerY - 4}px`;

         // Définir la couleur de la particule (par exemple, rose clair)
        particle.style.backgroundColor = '#B1C9EF'; // Changez cette valeur pour la couleur désirée

        // Appliquer l'animation CSS via la règle générée
        particle.style.animation = `particle-animation-${i} 1s ease-out forwards`;

        // Ajouter la particule au body
        document.body.appendChild(particle);

        // Supprimer la particule après l'animation
        setTimeout(() => {
            particle.remove();
        }, 1000);  // Attendre la fin de l'animation (1s)
    }
} 

function addComment(postId, commentText, commentsSection) {
    if (commentText) {
        const newComment = {
            username: "your_username",  // Remplacez par votre nom d'utilisateur
            text: commentText,
            replies: []  // Pas de sous-commentaires au début
        };

        const newCommentDiv = createCommentElement(newComment);
        commentsSection.appendChild(newCommentDiv);
    }
}

function createCommentElement(comment) {
    const commentDiv = document.createElement("div");
    commentDiv.classList.add("comment");

    const commentUsername = document.createElement("span");
    commentUsername.classList.add("comment-username");
    commentUsername.textContent = comment.username;
    commentDiv.appendChild(commentUsername);

    const commentText = document.createElement("span");
    commentText.textContent = `: ${comment.text}`;
    commentDiv.appendChild(commentText);

    const replyButton = document.createElement("button");
    replyButton.classList.add("comment-reply-button");
    replyButton.textContent = "Répondre";
    replyButton.addEventListener("click", () => {
        const commentInput = document.querySelector(".comment-input");
        commentInput.value = `@${comment.username} `;
        commentInput.focus();

        let repliesSection = commentDiv.querySelector(".replies");
        if (!repliesSection) {
            repliesSection = document.createElement("div");
            repliesSection.classList.add("replies");
            commentDiv.appendChild(repliesSection);
        }
    });

    commentDiv.appendChild(replyButton);

    const repliesSection = document.createElement("div");
    repliesSection.classList.add("replies");
    commentDiv.appendChild(repliesSection);

    return commentDiv;
}

function openModal(imageSrc, event) {
    const modal = document.createElement("div");
    modal.classList.add("modal");

    const modalImg = document.createElement("img");
    modalImg.src = imageSrc;
    modalImg.alt = "Full screen image";

    modal.appendChild(modalImg);

    modal.addEventListener("click", () => {
        modal.remove();
    });

    document.body.appendChild(modal);
}
