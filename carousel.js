const images = ['photos/aboutme1.jpg', 'photos/aboutme2.jpg', 'photos/aboutme3.jpg'];
let index = 0;
document.getElementById('carousel-image').src = images[0]; // Set initial image
setInterval(() => {
  index = (index + 1) % images.length;
  document.getElementById('carousel-image').src = images[index];
}, 3000);