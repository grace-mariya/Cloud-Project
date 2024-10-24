// Initialize Firebase Firestore and Storage
const db = firebase.firestore();
const storage = firebase.storage().ref();

// Function to create a new post
async function createPost() {
    const postContent = document.getElementById('postContent').value;
    const uploadImage = document.getElementById('uploadImage').files[0];

    if (!postContent) {
        alert('Post content cannot be empty!');
        return;
    }

    try {
        let imageUrl = null;

        // Check if an image is selected
        if (uploadImage) {
            const imageRef = storage.child(`posts/${uploadImage.name}`);
            const snapshot = await imageRef.put(uploadImage);
            imageUrl = await snapshot.ref.getDownloadURL();
        }

        // Create post object
        const post = {
            content: postContent,
            imageUrl: imageUrl,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        };

        // Push post data to Firestore
        await db.collection('posts').add(post);

        alert('Post created successfully!');
        document.getElementById('postContent').value = '';
        document.getElementById('uploadImage').value = '';

    } catch (error) {
        console.error('Error creating post:', error);
        alert('Failed to create post. Please try again.');
    }
}
