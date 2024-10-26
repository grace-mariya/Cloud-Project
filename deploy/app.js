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
                <button class="delete-button" onclick="deletePost('${post.id}', '${post.imageUrl}')">Delete</button>
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
                // Create a new document reference (to get the ID before adding data)
                const newPostRef = db.collection("blogPosts").doc();
                
                // Create the blog post object with the image URL and document ID
                const newPost = {
                    id: newPostRef.id,  // Add the document ID to the post data
                    title: "New Blog Post",
                    description: postContent,
                    imageUrl: downloadURL || "images/writer.jpg", // Use the uploaded image URL
                    date: currentDate
                };

                // Set the post data in Firestore using the generated document ID
                newPostRef.set(newPost)
                    .then(() => {
                        console.log("Document written with ID: ", newPostRef.id);
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

// Function to delete a post from Firestore and remove the associated image
async function deletePost(document_id, image_URL) {
    console.log("Image: "+ image_URL);
    console.log("Doc ID: "+ document_id);
    
    if (!image_URL) {
        console.error("imageUrl is undefined");
        return; // Exit the function if imageUrl is undefined
    }

    // Now proceed with the split
    const filePath = image_URL.split('/o/')[1].split('?')[0].replace(/%2F/g, '/');
    
    const ImageRef = storage.ref(filePath);
    ImageRef.delete().then(() => {
        console.log("Image Deleted: "+image_URL);
    }).catch((error) => {
        console.error('Error deleting from storage:', error);
    });
        
    // Reference to the document in Firestore
    const DocRef = db.collection("blogPosts").doc(document_id);
    DocRef.delete().then(() => {
        console.log("Data Deleted");
    }).catch((error) => {
        console.error('Error deleting from Firestore:', error);
    });
    
    loadPosts(); 
}

// Call the function to load posts from Firebase Firestore on page load
window.onload = function() {
    loadPosts();
};
