const track = document.getElementById("images");

if (track) {
  let isMouseDown = false;
  let startX = 0;
  let currentPercentage = 0;
  let prevPercentage = 0;

  const handleMouseDown = (e) => {
    isMouseDown = true;
    startX = e.clientX;
    track.style.cursor = 'grabbing';
  };

  const handleMouseUp = () => {
    isMouseDown = false;
    prevPercentage = currentPercentage;
    track.style.cursor = 'grab';
  };

  const handleMouseMove = (e) => {
    if (!isMouseDown) return;
    
    const mouseDelta = startX - e.clientX;
    const maxDelta = window.innerWidth / 2;
    
    const percentage = (mouseDelta / maxDelta) * -100;
    const nextPercentageUnconstrained = prevPercentage + percentage;
    const nextPercentage = Math.max(Math.min(nextPercentageUnconstrained, 0), -100);
    
    currentPercentage = nextPercentage;
    
    track.animate({
      transform: `translate(${nextPercentage}%, -50%)`
    }, { duration: 1200, fill: "forwards" });
    
    const images = track.getElementsByClassName("img");
    for (const image of images) {
      image.animate({
        objectPosition: `${nextPercentage + 100}% center`
      }, { duration: 1200, fill: "forwards" });
    }
  };

  // Mouse events
  track.addEventListener('mousedown', handleMouseDown);
  window.addEventListener('mouseup', handleMouseUp);
  window.addEventListener('mousemove', handleMouseMove);

  // Touch events for mobile
  track.addEventListener('touchstart', (e) => {
    handleMouseDown({ clientX: e.touches[0].clientX });
  });

  window.addEventListener('touchend', handleMouseUp);

  window.addEventListener('touchmove', (e) => {
    e.preventDefault();
    handleMouseMove({ clientX: e.touches[0].clientX });
  });

  // Set initial cursor
  track.style.cursor = 'grab';
}