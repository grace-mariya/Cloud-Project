// Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyBhVf3H5_S1TY1uUO5l58s2UvDjGfkr3ao",
    authDomain: "personal-blog-e98db.firebaseapp.com",
    projectId: "personal-blog-e98db",
    storageBucket: "personal-blog-e98db.appspot.com",
    messagingSenderId: "870275422226",
    appId: "1:870275422226:web:d49ed7ba3da5196d28a0cb"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();

// Load and display posts with delete icon
const loadPosts = () => {
    db.collection("posts").orderBy("timestamp", "desc").onSnapshot((snapshot) => {
        const postsContainer = document.getElementById("posts");
        postsContainer.innerHTML = "";
        snapshot.forEach((doc) => {
            const post = doc.data();
            postsContainer.innerHTML += `<div class="post">
                <p>${post.content}</p>
                <i class="fas fa-trash-alt delete-icon" onclick="deletePost('${doc.id}')"></i> <!-- Delete icon -->
            </div>`;
        });
    });
};

// Create a new post
const createPost = () => {
    const content = document.getElementById("postContent").value;
    if (content.trim() !== "") { // Ensure post content is not empty
        db.collection("posts").add({
            content: content,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });
        document.getElementById("postContent").value = ""; // Clear the textarea after posting
    }
};

// Delete a post
const deletePost = (id) => {
    db.collection("posts").doc(id).delete();
};

// Add emoji to textarea
const addEmoji = (emoji) => {
    const textArea = document.getElementById("postContent");
    textArea.value += emoji; // Append emoji to the current text
};

loadPosts();
