const images = ["photos/aboutme1.jpg", "aboutme2.jpg", "aboutme3.jpg"];
let currentIndex = 0;

function showNextImage() {
  currentIndex = (currentIndex + 1) % images.length;
  const img = document.getElementById("carousel-image");
  img.src = images[currentIndex];
}

setInterval(showNextImage, 3000); // Change image every 3 seconds
