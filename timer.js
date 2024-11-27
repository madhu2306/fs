
let hoursElem = document.getElementById('hours');
let minutesElem = document.getElementById('minutes');
let secondsElem = document.getElementById('seconds');
let millisecondsElem = document.getElementById('milliseconds');

let startButton = document.getElementById('start');
let pauseButton = document.getElementById('pause');
let restartButton = document.getElementById('restart');

let interval;
let startTime;
let elapsedTime = 0;
let isPaused = false;

function updateStopwatch() {
    let currentTime = Date.now();
    let timeDifference = currentTime - startTime;
    elapsedTime += timeDifference;

    let totalMilliseconds = Math.floor(elapsedTime % 1000);
    let totalSeconds = Math.floor(elapsedTime / 1000) % 60;
    let totalMinutes = Math.floor(elapsedTime / (1000 * 60)) % 60;
    let totalHours = Math.floor(elapsedTime / (1000 * 60 * 60));

    hoursElem.innerText = String(totalHours).padStart(2, '0');
    minutesElem.innerText = String(totalMinutes).padStart(2, '0');
    secondsElem.innerText = String(totalSeconds).padStart(2, '0');
    millisecondsElem.innerText = String(totalMilliseconds).padStart(3, '0');

    startTime = currentTime;
}

function startTimer() {
    if (!isPaused) {
        startTime = Date.now();
    } else {
        startTime = Date.now() - elapsedTime;
        isPaused = false;
    }
    interval = setInterval(updateStopwatch, 1);
}

function pauseTimer() {
    clearInterval(interval);
    isPaused = true;
}

function restartTimer() {
    clearInterval(interval);
    elapsedTime = 0;
    isPaused = false;
    hoursElem.innerText = "00";
    minutesElem.innerText = "00";
    secondsElem.innerText = "00";
    millisecondsElem.innerText = "000";
}

startButton.addEventListener('click', startTimer);
pauseButton.addEventListener('click', pauseTimer);
restartButton.addEventListener('click', restartTimer);
