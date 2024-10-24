// Firebase configuration
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

// Function to dynamically render posts
function renderPosts() {
    const postsContainer = document.querySelector(".posts-container");
    postsContainer.innerHTML = ''; // Clear the container first
    blogPosts.forEach((post, index) => {
        let postHTML = `
        <div class="post">
            <img src="${post.imageUrl}" alt="Post Image">
            <div class="post-content">
                <h3>${post.title}</h3>
                <p>${post.description}</p>
                <p class="post-date">${post.date}</p>
                <button class="delete-button" onclick="deletePost(${index})">Delete</button>
            </div>
        </div>
        `;
        postsContainer.innerHTML += postHTML;
    });
}

// Image upload handler
function uploadImageFile(callback) {
    const fileInput = document.getElementById('uploadImage');
    const file = fileInput.files[0];
    
    if (file) {
        const reader = new FileReader();
        reader.onload = function (event) {
            callback(event.target.result); // Return the image data URL
        };
        reader.readAsDataURL(file); // Convert the image to a data URL
    } else {
        callback(''); // If no image is selected, return an empty string
    }
}

// Function to create a new post and store it in Firebase Firestore and Firebase Storage
function createPost() {
    const postContent = document.getElementById('postContent').value;
    const currentDate = new Date().toLocaleDateString(); // Get current date
    const fileInput = document.getElementById('uploadImage');
    const file = fileInput.files[0];

    if (!file) {
        alert("Please select an image.");
        return;
    }

    // Create a storage reference
    const storageRef = storage.ref('blog_images/' + file.name);
    
    // Upload the image to Firebase Storage
    const uploadTask = storageRef.put(file);

    uploadTask.on('state_changed', 
        function progress(snapshot) {
            // You can handle the progress here if you want, e.g., display a progress bar
        }, 
        function error(err) {
            console.error("Image upload failed:", err);
        }, 
        function complete() {
            // Get the image URL once the upload is complete
            uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
                // Create the blog post object with the image URL
                const newPost = {
                    title: "New Blog Post",
                    description: postContent,
                    imageUrl: downloadURL || "images/writer.jpg", // Use the uploaded image URL
                    date: currentDate
                };

                // Push the post data to Firebase Firestore
                db.collection("blogPosts").add(newPost)
                    .then((docRef) => {
                        console.log("Document written with ID: ", docRef.id);
                        document.getElementById('postContent').value = ''; // Clear textarea
                        fileInput.value = ''; // Clear the file input
                        loadPosts(); // Reload posts after creating a new one
                    })
                    .catch((error) => {
                        console.error("Error adding document: ", error);
                    });
            });
        }
    );
}

// Function to load and render posts from Firestore
function loadPosts() {
    db.collection("blogPosts").get().then((querySnapshot) => {
        blogPosts = []; // Clear the local posts array
        querySnapshot.forEach((doc) => {
            blogPosts.push(doc.data()); // Add each post to the local array
        });
        renderPosts(); // Render the posts after loading them
    });
}

// Function to delete a post from Firestore and re-render the posts
function deletePost(index) {
    const postToDelete = blogPosts[index];
    
    // Delete the post from Firestore using the title (or you can use a document ID if available)
    db.collection("blogPosts")
      .where("title", "==", postToDelete.title)
      .get()
      .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
              doc.ref.delete().then(() => {
                  console.log("Document successfully deleted!");
                  loadPosts(); // Reload the posts after deletion
              }).catch((error) => {
                  console.error("Error removing document: ", error);
              });
          });
      });
}

// Call the function to load posts from Firebase Firestore on page load
window.onload = function() {
    loadPosts();
};
