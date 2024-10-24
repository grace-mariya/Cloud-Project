// Your Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAEivkVmVwau5ffznhGPiwTiUqQq_Gk6M0",
    authDomain: "grace-personal-blog.firebaseapp.com",
    projectId: "grace-personal-blog",
    storageBucket: "grace-personal-blog.appspot.com",
    messagingSenderId: "797429488609",
    appId: "1:797429488609:web:16258d32ea39a47d78d0a0"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const storage = firebase.storage();

// Function to render posts
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
                        <img src="${post.imageUrl}" alt="Post Image" style="width: 100%;">
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

// Function to create a new post
function createPost() {
    const postContent = document.getElementById("postContent").value;
    const uploadImage = document.getElementById("uploadImage").files[0];

    if (!postContent || !uploadImage) {
        alert("Please provide both content and an image.");
        return;
    }

    // Upload image to Firebase Storage
    const storageRef = storage.ref(`images/${uploadImage.name}`);
    storageRef.put(uploadImage).then((snapshot) => {
        console.log("Image uploaded successfully!");

        // Get the download URL and save the post to Firestore
        snapshot.ref.getDownloadURL().then((downloadURL) => {
            const postTitle = postContent.slice(0, 30); // Use first 30 characters as title
            const newPost = {
                title: postTitle,
                description: postContent,
                imageUrl: downloadURL
            };

            db.collection("posts").add(newPost).then(() => {
                console.log("Post added successfully!");
                document.getElementById("postContent").value = ''; // Clear textarea
                document.getElementById("uploadImage").value = ''; // Clear file input
                renderSinglePost(newPost); // Render the new post immediately
            }).catch((error) => {
                console.error("Error adding post: ", error);
            });
        });
    }).catch((error) => {
        console.error("Error uploading image: ", error);
    });
}

// Function to render a single post after creation
function renderSinglePost(post) {
    const postsContainer = document.querySelector(".posts-container");
    
    let postHTML = `
        <div class="post">
            <img src="${post.imageUrl}" alt="Post Image" style="width: 100%;">
            <div class="post-content">
                <h3>${post.title}</h3>
                <p>${post.description}</p>
                <button onclick="deletePost('${post.id}')">Delete</button>
            </div>
        </div>
    `;
    postsContainer.innerHTML += postHTML; // Add the new post to the container
}

// Call the function to render posts on page load
renderPosts();
