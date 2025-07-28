const rateButtons = document.querySelectorAll('.rate');
const submitBtn = document.querySelector('.btn');
const ratingBox = document.querySelectorAll('.whole-box')[0]; 
const thankYouBox = document.querySelectorAll('.whole-box')[1]; 
const resultText = document.querySelector('.result');

let selectedRating = null;

rateButtons.forEach(button => {
    button.addEventListener('click', () => {
        selectedRating = button.textContent;

        rateButtons.forEach(btn => {
            btn.style.backgroundColor = 'hsl(215, 18%, 25%)'; // original dark gray
            btn.style.color = 'white';
        });

        button.style.backgroundColor = 'white';
        button.style.color = 'hsl(25, 97%, 53%)';
    });
});

submitBtn.addEventListener('click', () => {
    if (selectedRating) {
        resultText.textContent = `You selected ${selectedRating} out of 5`;

        ratingBox.style.display = 'none';
        thankYouBox.style.display = 'block';
    } else {
        alert("Please select a rating before submitting.");
    }
});

