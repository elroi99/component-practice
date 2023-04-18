// selectors
let START_BTN = "start-btn";
let PAUSE_CONTINUE_BTN = "pause-continue-btn";
let RESET_BTN = "reset-btn";

// notes about activity state
// "reset" btn
let isCountingDown = false;
let pendingTime = 8772; // in seconds ofc // only use this as an input to the setInterval, not anywhere else
let timerReference = null;

let hours = 0;
let minutes = 0;
let seconds = 0;

// constants
const hourInSeconds = 60 * 60;
const minuteInSeconds = 60;

function setUpSetInterval() {
  return setInterval(() => {
    if (pendingTime > 0) {
      pendingTime--;
      console.log(pendingTime);
      updateCountdownTimerVariables(); // changes the state
      updateInputsOnScreen(hours, minutes, seconds);
    } else {
      resetCountdownTimer();
    }
    console.log(pendingTime);
  }, 1000);
}

function startCountdown() {
  isCountingDown = true;
  let countdownTimerReference = setUpSetInterval();
  return countdownTimerReference;
}

function pauseCountdown() {
  isCountingDown = false;
  clearInterval(timerReference);
  timerReference = null;
}

function resetCountdownTimer() {
  isCountingDown = false;
  pendingTime = 0;
  updateInputsOnScreen(0, 0, 0);
  clearInterval(timerReference);
  timerReference = null;
  hours = 0;
  minutes = 0;
  seconds = 0;
}

// pre-resume app flow. the user might do one of two things
// 1. pause the app, then resume it
// 2. pause the app, then CHANGE SOME MINUTES / HOURS / SECONDS and then resume

// implementation details -- we cannot pause an interval.....we can only clear an interval
function resumeCountdownTimer() {
  // get the current time stats
  // convert it into seconds and update
  isCountingDown = true;
  timerReference = startCountdown(pendingTime); // it is equivalent
}

// we can use two approaches to calculate the countdown time at any point of time
// option 1. we can maintain variables for hours , minutes and seconds. we will update these after every second
// option 2. we keep track of how many seconds pending in the timer. everytime a second passes, we just decrement from the pending seconds and then calculate hh-mm-ss

// although I have written code for both options, I have not used the 2nd option in the app. lets use the first method itself

// option 1
// this generates the countdown by individually updating seconds, and, if needed, minutes and hours too
// it does not use a function that convert total number of seconds ( like a timestamp ) into hh-mm-ss
function updateCountdownTimerVariables() {
  if (seconds === 0) {
    if (minutes === 0) {
      if (hours === 0) {
        resetCountdownTimer();
      } else if (hours > 0) {
        hours--;
        minutes = 59;
        seconds = 59;
      }
    } else if (minutes > 0) {
      minutes--;
      seconds = 59;
    }
  } else if (seconds > 0) {
    seconds--;
  }
}

// Xplodivity has much better logic for this -- much cleaner and saner
// although I have written this 2nd way of doing things, I have not used it in the app. lets use the first method itself
// option 2
// we will have to call this all the time ie. everytime the countdown timer ticks
// function convertTimestampToHHMMSS(totalPendingSeconds) {
//   let residualTime = totalPendingSeconds;
//   let hours = Math.floor(totalPendingSeconds / hourInSeconds);
//   residualTime = residualTime - hours * hourInSeconds;
//   let minutes = Math.floor(residualTime / minuteInSeconds);
//   residualTime = residualTime - minutes * minuteInSeconds;
//   let seconds = residualTime;

//   console.log({ hours, minutes, seconds });

//   return { hours, minutes, seconds };
// }

function convertHHMMSSToSeconds() {
  console.log(hours, minutes, seconds);
  return hours * hourInSeconds + minuteInSeconds * minuteInSeconds + seconds;
}

function getInputBoxTimeValues() {
  let hoursValue = document.getElementById("hours-input").value;
  let minutesValue = document.getElementById("minutes-input").value;
  let secondsValue = document.getElementById("seconds-input").value;
  hoursValue = hoursValue === "" ? 0 : parseInt(hoursValue);
  minutesValue = minutesValue === "" ? 0 : parseInt(minutesValue);
  secondsValue = secondsValue === "" ? 0 : parseInt(secondsValue);

  return { hours: hoursValue, minutes: minutesValue, seconds: secondsValue };
}

// sometimes the user will put in 77 in minutes... this is wrong. it should be 1hr 17 mins
function calculateAdjustedUserProvidedTime(hours, minutes, seconds) {
  let trueSeconds = seconds % 60;
  let derivedMinute = Math.floor(seconds / 60);
  minutes = minutes + derivedMinute;
  let trueMinutes = minutes % 60;
  let derivedHour = Math.floor(minutes / 60);
  hours = hours + derivedHour;

  return { hours: hours, minutes: trueMinutes, seconds: trueSeconds };
}

function getTimeValues() {
  let {
    hours: userProvidedHours,
    minutes: userProvidedMinutes,
    seconds: userProvidedSeconds,
  } = getInputBoxTimeValues();
  return calculateAdjustedUserProvidedTime(
    userProvidedHours,
    userProvidedMinutes,
    userProvidedSeconds
  );
}

// while displaying the value to the user, if we 0, it should be 00, 7 should be 07
function formatForScreen(number) {
  return number < 10 ? `0${number}` : number;
}

function updateInputsOnScreen(hours, minutes, seconds) {
  document.getElementById("hours-input").value = formatForScreen(hours);
  document.getElementById("minutes-input").value = formatForScreen(minutes);
  document.getElementById("seconds-input").value = formatForScreen(seconds);
}

window.onload = () => {
  const startBtn = document.getElementById(START_BTN);
  const pauseContinueBtn = document.getElementById(PAUSE_CONTINUE_BTN);
  const resetBtn = document.getElementById(RESET_BTN);

  const inputs = document.querySelectorAll("input");
  console.log(inputs);
  for (let i = 0; i < inputs.length; i++) {
    let input = inputs[i];
    input.addEventListener("input", (e) => {
      let {
        hours: resolvedHours,
        minutes: resolvedMinutes,
        seconds: resolvedSeconds,
      } = getTimeValues();
      console.log(resolvedHours, resolvedMinutes, resolvedSeconds);
      hours = resolvedHours;
      minutes = resolvedMinutes;
      seconds = resolvedSeconds;
      pendingPeriod = convertHHMMSSToSeconds();
    });
  }

  // we have access to all the state variables / flags via closure

  startBtn.addEventListener("click", () => {
    if (!isCountingDown) {
      isCountingDown = true;
      timerReference = startCountdown(pendingTime);
      startBtn.style.display = "none";
    }
  });

  pauseContinueBtn.addEventListener("click", () => {
    if (isCountingDown) {
      isCountingDown = false;
      clearInterval(timerReference);
      timerReference = null;
      pauseContinueBtn.innerText = "continue";
    } else {
      isCountingDown = true;
      timerReference = startCountdown();
    }
  });

  resetBtn.addEventListener("click", () => {
    resetCountdownTimer();
    if (!isCountingDown) {
      startBtn.style.display = "block";
    }
  });
};
