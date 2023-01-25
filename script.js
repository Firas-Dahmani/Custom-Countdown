const countdownForm = document.getElementById('countdownForm');
const inputContainer = document.getElementById('input-container');
const dateEl = document.getElementById('date-picker');

const countdownEl = document.getElementById('countdown');
const countdownElTitle = document.getElementById('countdown-title');
const countdownBtn = document.getElementById('countdown-button');
const timeElements = document.querySelectorAll('span');

const completeEl = document.getElementById('complete');
const completeElInfo = document.getElementById('complete-info');
const completeBtn = document.getElementById('complete-button');

let countdownTitle = '';
let countdownDate = '';
let countdownValue = Date;
let countdownActive;
let savedCountdown;

const second = 1000;
const minute = second * 60;
const hour = minute * 60;
const day = hour * 24;

// set the min date to the current date
const today = new Date().toISOString().split('T')[0]
dateEl.setAttribute('min', today)

// Populate countdown / Components UI
function updateDOM() {
    countdownActive = setInterval(() => {
        const now = new Date().getTime();
        const distance = countdownValue - now;

        // Caculate the time
        const days = Math.floor(distance / day)
        const hours = Math.floor((distance % day) / hour)
        const minutes = Math.floor((distance % hour) / minute)
        const seconds = Math.floor((distance % minute) / second)

        // Hide the input element
        inputContainer.hidden = true

        // if the countdown is ended, show the countdown complete
        if (distance < 0) {
            countdownEl.hidden = true
            clearInterval(countdownActive)
            completeElInfo.textContent = `${countdownTitle} finished on ${countdownDate}`
            completeEl.hidden = false
        } else {
            // else show the progress
            // Populate the countdown
            countdownElTitle.textContent = `${countdownTitle}`
            timeElements[0].textContent = `${days}`
            timeElements[1].textContent = `${hours}`
            timeElements[2].textContent = `${minutes}`
            timeElements[3].textContent = `${seconds}`
            // show the counter
            completeEl.hidden = true;
            countdownEl.hidden = false
        }
    }, second)
}

//take the value from the form input 
function updateCountdown(e) {
    e.preventDefault()
    countdownTitle = e.srcElement[0].value
    countdownDate = e.srcElement[1].value
    savedCountdown = {
        title: countdownTitle,
        date: countdownDate,
    };
    localStorage.setItem('countdown', JSON.stringify(savedCountdown));
    // check if the date value is valid
    if (countdownDate === '') {
        alert('Please enter a date')
    } else {
        // get number version of the current date , update the DOM
        countdownValue = new Date(countdownDate).getTime()
        updateDOM()
    }
}

// reset the counter 
function resetCounter() {
    // Hide the counter 
    inputContainer.hidden = false
    countdownEl.hidden = true
    completeEl.hidden = true
    // Stop the counter
    clearInterval(countdownActive)
    // Reset values, remove localStorage item
    countdownTitle = '';
    countdownDate = '';
    localStorage.removeItem('countdown');
}

function restorePreviousCountdown() {
    // Get countdown from localStorage if available
    if (localStorage.getItem('countdown')) {
        inputContainer.hidden = true;
        savedCountdown = JSON.parse(localStorage.getItem('countdown'));
        countdownTitle = savedCountdown.title;
        countdownDate = savedCountdown.date;
        countdownValue = new Date(countdownDate).getTime();
        updateDOM();
    }
}

// Event listeners 
countdownForm.addEventListener('submit', updateCountdown)
countdownBtn.addEventListener('click', resetCounter)
completeBtn.addEventListener('click', resetCounter)

// On Load, check localStorage
restorePreviousCountdown();