(function () {
  var hour = document.querySelector(".hour");
  var min = document.querySelector(".minute");
  var sec = document.querySelector(".sec");

  var startBtn = document.querySelector(".start");
  var stopBtn = document.querySelector(".stop");
  var resetBtn = document.querySelector(".reset");

  var countdownTimer = null;
  startBtn.addEventListener("click", function () {
    if (hour.value == 0 && min.value == 0 && sec.value == 0) {
    }

    function startInterval() {
      startBtn.style.display = "none";
      stopBtn.style.display = "initial";

      countdownTimer = setInterval(() => {
        timer();
      }, 1000);
    }

    function stopInterval() {}

    function timer() {
      if (hour.value == 0 && min.value == 0 && sec.value == 0) {
        hour.value = "";
        min.value = "";
        sec.value = "";
        stopInterval();
      } else if (sec != 0) {
        sec.value = `${sec.value < 10 ? "0" : ""} ${sec.value - 1}`;
      }
    }
  });
})();

function formatCurrency(currencySymbol, decimalSeparator) {
  return function (value) {
    console.log(`yomama ${value} ${currencySymbol} ${decimalSeparator}`);
  };
}

// The HOC will
// 1. use HOC to create super component call
// 2. use component ( call )

// render props typically contains only UI. not logic
// use a component
// in order to pass some
