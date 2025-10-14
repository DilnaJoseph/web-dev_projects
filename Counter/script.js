const count = document.querySelector('.number');

const dec = document.querySelector('.btn1');
const res = document.querySelector('.btn2');
const inc = document.querySelector('.btn3');

let c = 0;

dec.addEventListener("click",()=>{
    c--;
    count.textContent=c;
    color();
});

res.addEventListener("click",()=>{
    c = 0;
    count.textContent=c;
    color();
});
inc.addEventListener("click",()=>{
    c++;
    count.textContent=c;
    color();
});

function color(){
    if(c>0){
        count.style.color =  "rgb(0, 255, 0)"; 
    }else if(c<0){
        count.style.color =  "rgb(255, 0, 0)"; 
    }else{
        count.style.color =  "rgb(161, 161, 253)";    
    }
}

count.addEventListener("mouseenter", () => {
  count.style.color = ""; 
});

count.addEventListener("mouseleave", () => {
  colour();
});