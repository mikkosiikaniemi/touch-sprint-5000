const finger1 = document.getElementById("finger-left");
const body = document.body;
const distanceDisplay = document.getElementById("distance");
const time = document.getElementById("time");
const timerDisplay = document.getElementById("timer");
const instructions = document.getElementById("instructions");
const remaining = document.getElementById("remaining");
const version = document.getElementById("version");
const highscores = document.getElementById("highscores");
const again = document.getElementById("again");

const originalPositionY1 = finger1.style.top;
const originalPositionX1 = finger1.style.left;
const originalDistanceFromTop1 = finger1.offsetTop;

let isDragging1 = false;
let offsetX1, offsetY1;
let initialPositionX1, initialPositionY1;
let totalDistance = 5000;
let highScoreArray = [];

let startTime, endTime;
let timerId;
let gameComplete = false;

// Add mouse and touch event listeners
finger1.addEventListener("touchstart", startDrag1);
finger1.addEventListener("touchmove", drag1);
finger1.addEventListener("touchend", endDrag1);

document.addEventListener('touchmove', function (event) {
	if (event.scale !== 1) { event.preventDefault(); }
}, { passive: false });

populateHighscores();

function populateHighscores() {
	let highScoresJSON = localStorage.getItem('highscores');
	if (!highScoresJSON) {
		highscores.textContent = 'No highscores yet.';
	} else {
		highScoreArray = JSON.parse(highScoresJSON);
		highScoreArray.sort(function(a,b) {
			return a[0] - b[0];
		});
		let highScoreHTML = '<table><tr><th colspan="3">Local highscores</th></tr><tr>';
		for (let i = 0; i < highScoreArray.length; i++) {
			// Date: formatEpochTime(highScoreArray[i][1])
			highScoreHTML += '<td>⏱️' + highScoreArray[i][0] + ' ms</td>';
			if (i >= 2) {
				break;
			}
		}
		highScoreHTML += '</tr></table>';
		highscores.innerHTML = highScoreHTML;

	}
}

function startDrag1(e) {
	isDragging1 = true;

	// Start the timer
	if (!startTime) {
		startTime = performance.now();
	}
	updateTimer();

	if (instructions) {
		instructions.remove();
		highscores.remove();
		time.style.display = 'block';
		remaining.style.display = 'block';
	}

	// Handle both mouse and touch events
	if (e.type === "mousedown") {
		offsetX1 = e.clientX - finger1.getBoundingClientRect().left;
		offsetY1 = e.clientY - finger1.getBoundingClientRect().top;
	} else if (e.type === "touchstart") {
		const touch = e.touches[0];
		offsetX1 = touch.clientX - finger1.getBoundingClientRect().left;
		offsetY1 = touch.clientY - finger1.getBoundingClientRect().top;
	}

	// Store the initial position of the element
	initialPositionX1 = parseInt(finger1.style.left) || 0;
	initialPositionY1 = parseInt(finger1.style.top) || 0;

	// Set the element's position to "fixed" so it can be dragged freely
	finger1.style.position = "fixed";
	finger1.style.zIndex = "1000";
}

function drag1(e) {
	if (!isDragging1) return;

	let clientX, clientY;
	if (e.type === "mousemove") {
		clientX = e.clientX;
		clientY = e.clientY;
	} else if (e.type === "touchmove") {
		const touch = e.touches[0];
		clientX = touch.clientX;
		clientY = touch.clientY;
	}

	// Calculate the new position and distance for draggableElement1
	const newY1 = clientY - offsetY1;
	const newX1 = clientX - offsetX1;

	// Calculate the distance moved during this drag
	let distanceY1 = newY1 - initialPositionY1;

	// Deduct the original elemtent distance from the top of the viewport
	if (distanceY1 === newY1) {
		distanceY1 -= originalDistanceFromTop1;
	}

	// Update the element's position based on the mouse/touch position and offset
	finger1.style.left = newX1 + "px";
	finger1.style.top = newY1 + "px";

	// Update the total distance
	totalDistance -= distanceY1;

	initialPositionY1 = newY1;

	// Update the background position to move it together with the element
	body.style.backgroundPositionY = -totalDistance + "px";

	distanceDisplay.textContent = totalDistance.toFixed(0);
}

function endDrag1() {
	// Reset the element's position to "absolute" and return it to its original place
	finger1.style.position = "absolute";
	finger1.style.zIndex = "0";
	finger1.style.left = originalPositionX1;
	finger1.style.top = originalPositionY1;

	isDragging1 = false;
}

function updateTimer() {

	timerId = setInterval(() => {
		const currentTime = performance.now();
		const elapsedTime = (currentTime - startTime).toFixed();
		if (totalDistance > 0 ) {
			timerDisplay.textContent = elapsedTime;
		} else if ( gameComplete === false ) {
			finger1.remove();
			remaining.style.fontSize = '8em';
			remaining.style.bottom = '30%';
			timerDisplay.style.fontSize = '3em';
			remaining.textContent = '🤩🏆';
			clearInterval(timerId);
			highScoreArray.push( [ elapsedTime, Date.now() ] );
			localStorage.setItem('highscores', JSON.stringify(highScoreArray));
			timerDisplay.textContent = elapsedTime;
			gameComplete = true;
			again.style.display = 'block';
		}
	}, 10);

}

version.addEventListener("click", function (e) {
	body.style.backgroundImage = 'url("grass.svg")';
});

function formatEpochTime(epoch) {
	const date = new Date(epoch); // Convert seconds to milliseconds
	const day = String(date.getDate()).padStart(2, "0"); // Add leading zero if needed
	const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
	const year = String(date.getFullYear()).slice(-2); // Get the last two digits of the year
	const hours = String(date.getHours()).padStart(2, "0");
	const minutes = String(date.getMinutes()).padStart(2, "0");

	return `${day}.${month}.${year} ${hours}:${minutes}`;
}

again.addEventListener("click", function (e) {
	location.reload();
});
