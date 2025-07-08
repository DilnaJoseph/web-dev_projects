// variables

let btn = document.querySelector("#new-quote");
let quote = document.querySelector(".quote");
let person = document.querySelector(".person");

const quotes = [
    // 1
    {
        quote:`"The only way to do great work is to love what you do."`,
        person:` Steve Jobs`
    },
    // 2
    {
        quote:`"Success is not final, failure is not fatal: It is the courage to continue that counts."`,
        person:`Winston Churchill`
    },
    // 3
    {
        quote:`"Believe you can and you're halfway there."`,
        person:`Theodore Roosevelt`
    },
    // 4
    {
        quote:`"Don’t watch the clock; do what it does. Keep going."`,
        person:` Sam Levenson`
    },
    // 5
    {
        quote:`"The future belongs to those who believe in the beauty of their dreams."`,
        person:`Eleanor Roosevelt`
    },
    // 6
    {
        quote:`"Start where you are. Use what you have. Do what you can."`,
        person:`Arthur Ashe`
    },
    // 7
    {
        quote:`"Everything you’ve ever wanted is on the other side of fear."`,
        person:`George Addair`
    },
    // 8
    {
        quote:`"Do not wait to strike till the iron is hot; but make it hot by striking."`,
        person:`William Butler Yeats`
    },
    // 9
    {
        quote:`"What lies behind us and what lies before us are tiny matters compared to what lies within us."`,
        person:`Ralph Waldo Emerson`
    },
    // 10
    {
        quote:`"Whether you think you can or you think you can’t, you’re right."`,
        person:`Henry Ford`
    },
    // 11
    {
        quote:`"Hardships often prepare ordinary people for an extraordinary destiny."`,
        person:`C.S. Lewis`
    },
    // 12
    {
        quote:`"Your time is limited, so don’t waste it living someone else’s life."`,
        person:` Steve Jobs`
    },
    // 13
    {
        quote:`"Act as if what you do makes a difference. It does."`,
        person:`William James`
    },
    // 14
    {
        quote:`"Success usually comes to those who are too busy to be looking for it."`,
        person:`Henry David Thoreau`
    },
    // 15
    {
        quote:`"Don’t be pushed around by the fears in your mind. Be led by the dreams in your heart."`,
        person:`Roy T. Bennett`
    },
    // 16
    {
        quote:`"If you want to lift yourself up, lift up someone else."`,
        person:` Booker T. Washington`
    },
    // 17
    {
        quote:`"It always seems impossible until it’s done."`,
        person:`Nelson Mandela`
    },
    // 18
    {
        quote:`"You miss 100% of the shots you don’t take."`,
        person:`Wayne Gretzky`
    },
    // 19
    {
        quote:`"Success is walking from failure to failure with no loss of enthusiasm."`,
        person:`Winston Churchill`
    },
    // 20
    {
        quote:`"Dream big and dare to fail."`,
        person:`Norman Vaughan`
    }
];

btn.addEventListener("click",function(){
    let random = Math.floor(Math.random()*quotes.length);

    quote.innerText = quotes[random].quote;
    person.innerText = quotes[random].person;
})
