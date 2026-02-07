function format(value){
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