// Get all circle elements
const circles = [];

for (let i = 0; i < 3; i++) {
    const circle = document.createElement('div');
    circle.classList.add('circle');
    document.body.appendChild(circle);
    circles.push(circle);
}

// Event listener for mouse movement
document.addEventListener('mousemove', (event) => {
    circles.forEach((circle, index) => {
        const delay = index * 50; // Delay for each circle
        // Calculate the new position
        setTimeout(() => {
            circle.style.transform = `translate(${event.clientX}px, ${event.clientY}px)`;
        }, delay);
    });
});
