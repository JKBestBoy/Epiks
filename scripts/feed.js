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
    // Création de l'élément principal du post
    const postDiv = document.createElement("div");
    postDiv.classList.add("post");

    // Header du post avec l'utilisateur
    const postHeader = document.createElement("div");
    postHeader.classList.add("post-header");

    const profileImg = document.createElement("img");
    profileImg.src = post.profile_pic;
    profileImg.alt = "Profile pic";
    profileImg.classList.add("profile-pic"); // Ajouter la classe de style pour l'image de profil

    const username = document.createElement("span");
    username.classList.add("username");
    username.textContent = post.username;

    postHeader.appendChild(profileImg);
    postHeader.appendChild(username);
    postDiv.appendChild(postHeader);

    // Image du post (affichée uniquement si elle existe)
    if (post.image) {
        const img = document.createElement("img");
        img.src = post.image;
        img.alt = "Post image";
        img.classList.add("post-image"); // Appliquer la classe CSS pour l'image du post
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

    // Bouton Like
    const likeButton = document.createElement("button");
    likeButton.classList.add("reaction-button");
    likeButton.innerHTML = "👍";
    likeButton.addEventListener("click", () => handleReaction(post.id, "like"));
    reactionsDiv.appendChild(likeButton);

    // Bouton Dislike
    const dislikeButton = document.createElement("button");
    dislikeButton.classList.add("reaction-button");
    dislikeButton.innerHTML = "👎";
    dislikeButton.addEventListener("click", () => handleReaction(post.id, "dislike"));
    reactionsDiv.appendChild(dislikeButton);

    // Bouton Love
    const loveButton = document.createElement("button");
    loveButton.classList.add("reaction-button");
    loveButton.innerHTML = "❤️";
    loveButton.addEventListener("click", () => handleReaction(post.id, "love"));
    reactionsDiv.appendChild(loveButton);

    // Bouton Commentaire
    const commentButton = document.createElement("button");
    commentButton.classList.add("reaction-button");
    commentButton.innerHTML = "💬";
    commentButton.addEventListener("click", () => handleReaction(post.id, "comment"));
    reactionsDiv.appendChild(commentButton);

    postDiv.appendChild(reactionsDiv);
    return postDiv;
}

function handleReaction(postId, reactionType) {
    console.log(`Post ${postId} réagit avec : ${reactionType}`);
    // Code pour gérer les réactions (comme incrémenter un compteur, etc.)
}
