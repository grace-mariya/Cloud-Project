function renderPosts() {
    const postsContainer = document.querySelector(".posts-container");
    postsContainer.innerHTML = ''; // Clear the container first

    db.collection("posts").get().then((querySnapshot) => {
        if (querySnapshot.empty) {
            console.log("No posts found.");
            postsContainer.innerHTML = '<p>No blog posts available.</p>';
        } else {
            querySnapshot.forEach((doc) => {
                const post = doc.data();
                console.log("Post retrieved: ", post); // Log to check data

                let postHTML = `
                    <div class="post">
                        <img src="${post.imageUrl}" alt="Post Image">
                        <div class="post-content">
                            <h3>${post.title}</h3>
                            <p>${post.description}</p>
                            <button onclick="deletePost('${doc.id}')">Delete</button>
                        </div>
                    </div>
                `;
                postsContainer.innerHTML += postHTML;
            });
        }
    }).catch((error) => {
        console.error("Error fetching posts: ", error); // Log any errors
    });
}
