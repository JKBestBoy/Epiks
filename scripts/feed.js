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

        img.addEventListener("click", () => openModal(img.src));

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

    const likeButton = createReactionButton("👍", "like", post.id);
    const dislikeButton = createReactionButton("👎", "dislike", post.id);
    const loveButton = createReactionButton("❤️", "love", post.id);
    const commentButton = createReactionButton("💬", "comment", post.id);

    reactionsDiv.appendChild(likeButton);
    reactionsDiv.appendChild(dislikeButton);
    reactionsDiv.appendChild(loveButton);
    reactionsDiv.appendChild(commentButton);

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

function createReactionButton(icon, reactionType, postId) {
    const button = document.createElement("button");
    button.classList.add("reaction-button");
    button.innerHTML = `<span class="icon">${icon}</span>`;
    button.addEventListener("click", () => handleReaction(postId, reactionType, button));
    return button;
}

function handleReaction(postId, reactionType, button) {
    const icon = button.querySelector(".icon");
    if (icon) {
        icon.classList.add("heartbeat");
        setTimeout(() => {
            icon.classList.remove("heartbeat");
        }, 400);
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

    // Ajouter un bouton pour répondre
    const replyButton = document.createElement("button");
    replyButton.classList.add("comment-reply-button");
    replyButton.textContent = "Répondre";
    replyButton.addEventListener("click", () => {
        const commentInput = document.querySelector(".comment-input");
        commentInput.value = `@${comment.username} `;
        commentInput.focus();

        // Ajout de la section pour les réponses si elle n'existe pas encore
        let repliesSection = commentDiv.querySelector(".replies");
        if (!repliesSection) {
            repliesSection = document.createElement("div");
            repliesSection.classList.add("replies");
            commentDiv.appendChild(repliesSection);
        }
    });

    commentDiv.appendChild(replyButton);

    // Ajouter un conteneur pour les sous-commentaires (réponses)
    const repliesSection = document.createElement("div");
    repliesSection.classList.add("replies");
    commentDiv.appendChild(repliesSection);

    return commentDiv;
}

function openModal(imageSrc) {
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