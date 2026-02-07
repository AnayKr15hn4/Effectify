const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";

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
});