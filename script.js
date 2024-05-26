const typingText = document.querySelector('.typing-text');
const input = document.querySelector('.wrapper .input-field');
const time = document.querySelector('.time span b');
const mistakes = document.querySelector('.mistake span');
const wpm = document.querySelector('.wpm span');
const cpm = document.querySelector('.cpm span');
const btn = document.querySelector('button');

// set value
let timer;
let maxTime = 60;
let timeLeft = maxTime;
let charIndex = 0;
let Mistake = 0;
let isTyping = false;

function loadParagraph(){
    
    fetch("https://type.fit/api/quotes")
    .then(response => {
        return response.json()
    })
    .then(data =>{
        const qoutes =  data.map(qoute => qoute.text);

        const randomIndex = Math.floor(Math.random() * qoutes.length);
        typingText.innerHTML = ''; 
        const paragraph = qoutes[randomIndex];
        
        for(const char of paragraph){
            console.log(char);
            typingText.innerHTML += `<span>${char}</span>`;
        }
        typingText.querySelectorAll('span')[0].classList.add('active');
        document.addEventListener('keydown' , ()=> input.focus());
        typingText.addEventListener('click', ()=> input.focus());
    })
    .catch(error => {
        console.log(`Error fetching qoutes`, error);
    })
    }

// handle user input
function initTyping(){
    const char = typingText.querySelectorAll('span');
    const typedChar = input.value.charAt(charIndex);

    if(charIndex < char.length && timeLeft > 0) {

        if(!isTyping){
            timer = setInterval(initTimer,1000);
            isTyping = true;
        }

        if(char[charIndex].innerText === typedChar){
            char[charIndex].classList.add("correct");
        }
        else{
            Mistake++;
            char[charIndex].classList.add("incorrect");
        }
        char[charIndex].classList.add('active');
        charIndex++;

        if(charIndex < char.length){
            char[charIndex].classList.add('active');
        }
        
        mistakes.innerText = Mistake;
        cpm.innerText = charIndex - Mistake;
    }
    else{
        clearInterval(timer);
        input.value = '';
    }
}

function initTimer(){
    if(timeLeft > 0){
        timeLeft--;
        time.innerText = timeLeft;

        const wpmVal = Math.round(((charIndex - Mistake)/5) /(maxTime - timeLeft)*60)
        wpm.innerText = wpmVal;
    }
    else {
        clearInterval(timer);
    }
}

function reset(){
    loadParagraph();
    timeLeft = maxTime;
    charIndex = 0;
    Mistake = 0;
    isTyping = false;
    input.value = "";
    clearInterval(timer);
    wpm.innerText = 0; 
    cpm.innerText = 0;
    mistakes.innerText = 0;
    time.innerText = timeLeft;
}

input.addEventListener("input", initTyping);
btn.addEventListener('click', reset);
loadParagraph();
