import { Effect } from "../types/Effect";

export const effects: Effect[] = [
  {
    id: "cypher-animation",
    title: "Cypher Text Animation",
    category: "text",
    description:
      "Matrix-style text decryption effect on hover with random character cycling",
    preview: "/effects/cypher_animation/index.html",
    video: "/cypher.mp4",
    thumbnail:
      "https://images.pexels.com/photos/270348/pexels-photo-270348.jpeg?auto=compress&cs=tinysrgb&w=600",
    code: {
      html: `<h1 data-value="HOVER OVER ME">HOVER OVER ME</h1>`,
      css: `body {
  margin: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  background-color: black;
  height: 100vh;
}

h1 {
  color: white;
  font-family: "Space Mono", monospace;
  font-size: 5rem;
  cursor: pointer;
  user-select: none;
  transition: all 0.3s ease;
}

h1:hover {
  text-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
}`,
      js: `const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";

document.querySelectorAll("h1").forEach(function(h1) {
    h1.addEventListener("mouseover", function(event) {
        let iterations = 0
        
        const interval = setInterval(() => {
        event.target.innerText = event.target.innerText.split("")
        .map((letter, index) => {
            if(index < iterations){
                return event.target.dataset.value[index];
            }
            
            return letters[Math.floor(Math.random()*36)]
        })
        .join("");
        
        if(iterations >= event.target.dataset.value.length) clearInterval(interval);
        
        iterations += 1 / 3;
        }, 30);
    });
});`,
    },
    tags: ["matrix", "hover", "Scramble", "cypher"],
        author: 'Anay Krishna',
        status:""
  },
  {
    id: "carousel-gallery",
    title: "Interactive Carousel",
    category: "gallery",
    description:
      "Smooth draggable image carousel with parallax object positioning",
    preview: "/effects/carasell/index.html",
    video: "/paralax.mp4",
    thumbnail:
      "https://images.pexels.com/photos/270348/pexels-photo-270348.jpeg?auto=compress&cs=tinysrgb&w=600",
    code: {
      html: `<div id="images" data-mouse-down-at="0" data-prev-percentage="0">
  <img class="img" src="https://images.unsplash.com/photo-1521405617584-1d9867aecad3?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8cm9sbHMlMjByb3ljZXxlbnwwfDB8MHx8fDA%3D" draggable="false">
  <img class="img" src="https://images.unsplash.com/photo-1646988681493-7f7c9ebde49f?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" draggable="false">
  <img class="img" src="https://images.unsplash.com/photo-1699325524552-555bd48866b6?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjN8fHBvcnNjaGUlMjA5MTF8ZW58MHwwfDB8fHww" draggable="false">
</div>`,
      css: `body {
  background-color: black;
  height: 100vh;
  width: 100vw;
  margin: 0rem;
  overflow: hidden;
}

#images > .img {
  width: 40vmin;
  height: 56vmin;
  object-fit: cover;
  object-position: right;
  user-select: none;
  pointer-events: none;
}

#images {
  display: flex;
  position: absolute;
  gap: 4vmin;
  left: 50%;
  top: 50%;
  transform: translate(0%, -50%);
}`,
      js: `const track = document.getElementById("images");

window.onmousedown = e => {
  track.dataset.mouseDownAt = e.clientX;
}

window.onmouseup = () => {
  track.dataset.mouseDownAt = "0";
  track.dataset.prevPercentage = track.dataset.percentage;
}

window.onmousemove = e => {
  if(track.dataset.mouseDownAt === "0") return;
  
  const mouseDelta = parseFloat(track.dataset.mouseDownAt) - e.clientX;
  const maxDelta = window.innerWidth / 2;
  
  const percentage = (mouseDelta / maxDelta) * -100;
  const nextPercentageUnconstrained = parseFloat(track.dataset.prevPercentage) + percentage;
  const nextPercentage = Math.max(Math.min(nextPercentageUnconstrained, 0), -100);
  
  track.dataset.percentage = nextPercentage;
  track.animate({transform: \`translate(\${nextPercentage}%, -50%)\`}, {duration: 1200, fill: "forwards"});
  
  for(const image of track.getElementsByClassName("img")){
    image.animate({objectPosition: \`\${nextPercentage+100}% center\`}, {duration: 1200, fill: "forwards"});
  }
}`,
    },
    tags: ["carousel", "drag", "parallax", "image"],
        author: 'Anay Krishna',
        status:""
  },
  {
    id: "mouse-tracking-bg",
    title: "Mouse Tracking Background",
    category: "bg",
    description:
      "Interactive mouse-tracking background with fluid motion, static motion, and a soft glow trail",
    preview: "/effects/mouse_tracking_bg/index.html",
    video: "/mouse_tracking.mp4",
    thumbnail: "../../public/mouse_tracking.png",
    code: {
      html: `<div id="blob"></div>
    <div id="blur"></div>

    <h1>ACTIVE BACKGROUND</h1>`,
      css: `/* custom font */
.space-mono-bold {
  font-family: "Space Mono", monospace;
  font-weight: 700;
  font-style: normal;
}
/* morphing blob */
#blob{
    background-color: white;
    height: 500px;
    aspect-ratio: 1;
    position: absolute;
    top: 50%;
    left: 50%;
    border-radius: 50%;
    background: linear-gradient(
        to right,
        aquamarine,
        mediumpurple    
    );
    animation: rotate 20s infinite;
}
/* text */
h1{
  z-index: 3;
  color: white;
  font-family: "Space Mono",monospace;
  font-size: 5rem;
}
/* blur 4 blob */
#blur {
    height: 100%;
    width: 100%;
    position: absolute;
    z-index: 2;
    backdrop-filter: blur(200px);    
}
/* animation 4 morphing */
@keyframes rotate {
    from {
      /* Starting state of the animation */
      rotate: 0deg;
    }

    50% {
        scale: 1 1.5;
    }
    to {
      /* Ending state of the animation */
      rotate: 360deg;
    }
  }
/* default body */
  body{
    margin: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow-x: hidden;
    overflow-y: hidden;
    background-color: black;
}`,
      js: `const blob = document.getElementById("blob");

document.body.onpointermove = event => {
    const { clientX, clientY } = event;
    blob.animate({
        left : (clientX-250) + "px",
        top : (clientY-250) + "px"
    },{ duration:3000, fill:"forwards" });
}`,
    },
    tags: ["glow", "interactive", "mouse tracking", "fluid"],
        author: 'Anay Krishna',
        status:""
  },
  {
    id: "show-on-scroll",
    title: "Scroll Trigger Animation",
    category: "scroll",
    description:
      "Interactive, scroll trigger animation with singular and staggerd animations",
    preview: "/effects/show_on_scroll/index.html",
    video: "/show_on_scroll.mp4",
    thumbnail: "../../public/mouse_tracking.png",
    code: {
      html: `<div class="spacer"></div>
    <section class="hidden">
        <h1>SHOW ON SCROLL</h1>
    </section>
    <div class="spacer"></div>
    <section class="hidden">
        <h1>LOOK</h1>
        <p>this animation is triggered by a scroll checkpoint</p>
    </section>
    <div class="spacer"></div>
    <section class="hidden">
        <h1>STAGGER</h1>
        <div class="logos">
            <div class="hidden logo">1 &nbsp;</div>
            <div class="hidden logo">2 &nbsp;</div>
            <div class="hidden logo">3 &nbsp;</div>
            <div class="hidden logo">4 &nbsp;</div>
        </div>
    </section>
    <div class="spacer"></div>
`,
      css: `body{
    background-color: #131316;
    color: #ffffff;
    font-family: 'archivo';
    padding: 0;
    margin: 0;
    overflow-x: hidden;
}

section{
    display: grid;
    place-items: center;
    align-content: center;
    margin-top: 350px;
    margin-bottom: 350px;
}

section h1{

    font-weight: 900;
    font-size: 3rem;

}

.hidden{
    opacity: 0;
    filter: blur(5px);
    transition: all 1s;
}


.show{
    opacity: 1;
    filter: blur(0px);
    transform: translateX(0);
}



.logos{
    display: flex;
    font-size: 2rem;
    font-weight: 900;
}

.logo:nth-child(2){
    transition-delay: 200ms;
}
.logo:nth-child(3){
    transition-delay: 400ms;
}
.logo:nth-child(4){
    transition-delay: 600ms;
}
`,
      js: `const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add('show');
        } else {
            entry.target.classList.remove('show');
        }
    });
}, { rootMargin: "0px 0px" });

const hiddenElements = document.querySelectorAll('.hidden');
hiddenElements.forEach((el) => observer.observe(el));
`,
    },
    tags: ["interactive", "Single", "Stagger", "Smooth"],
        author: 'Anay Krishna',
        status:""
  },
  {
    id: "digital-clock",
    title: "Digital Clock",
    category: "others",
    description:
      "A digital clock that shows the current time",
    preview: "/effects/digital_clock/index.html",
    video: "/digital_clock.mp4",
    thumbnail: "../../public/mouse_tracking.png",
    code: {
      html: `<div class="container">

        <div class="time" id="time">--:--:--</div>

    </div>
    <script src="index.js"></script>
`,
      css: `body {
    background-color: #030608;
    overflow: hidden;
}

.container {
    padding-top: 15%;
    padding-bottom: 15%;
    width: 100%;
    height: 100%;
    display: grid;
    place-items: center;
}

.time {
    font-family: monospace;
    font-weight: bolder;
    font-size: 12rem;
    /* color: #030608; */
      color: aliceblue;
    top: 10%;
}
`,
      js: `function format(value){
    return String(value).padStart(2, '0');
}


function clock(){
let d = new Date();
const s =d.getSeconds();
const m =d.getMinutes();
const h =d.getHours()%12;
document.getElementById("time").innerHTML = format(h) + ":" + format(m) + ":" + format(s);
}

setInterval(clock,1000)
`,
    },
    tags: [ "time", "clock"],
    author: 'Anay Krishna',
    status:""
  },
];


// {
//     id: "Unique Identifier",
//     title: "Name That Shows",
//     category: "'text' | 'scroll' | 'bg' | 'gallery' | 'button' | 'loading' | 'others'",
//     description: "describe the effect",
//     preview: "/effects/effect_name/index.html",
//     video: "/video_name.mp4",
//     thumbnail: "../../public/backup_image.png",
//     code: {
//       html: ` code html code html `,
//       css: ` code css code css `,
//       js: ` code js code js `,
//     },
//     tags: [ "glow", "interactive", "mouse tracking", "hover", "image"],
//     author: 'name/ only glows if value is anay krishna',
//     status:""
//   },