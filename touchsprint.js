const draggableElement = document.getElementById("draggable");
const body = document.body;
const distanceDisplay = document.getElementById("distance");

const originalPositionY = draggableElement.style.top;
const originalPositionX = draggableElement.style.left;
const originalDistanceFromTop = draggableElement.offsetTop;

let isDragging = false;
let offsetX, offsetY;
let initialPositionX, initialPositionY;
let totalDistance = 0;

// Add mouse and touch event listeners
draggableElement.addEventListener("mousedown", startDrag);
draggableElement.addEventListener("touchstart", startDrag);

document.addEventListener("mousemove", drag);
document.addEventListener("touchmove", drag);

document.addEventListener("mouseup", endDrag);
document.addEventListener("touchend", endDrag);

document.addEventListener('touchmove', function (event) {
	if (event.scale !== 1) { event.preventDefault(); }
}, { passive: false });

function startDrag(e) {
	isDragging = true;

	// Handle both mouse and touch events
	if (e.type === "mousedown") {
		offsetX = e.clientX - draggableElement.getBoundingClientRect().left;
		offsetY = e.clientY - draggableElement.getBoundingClientRect().top;
	} else if (e.type === "touchstart") {
		const touch = e.touches[0];
		offsetX = touch.clientX - draggableElement.getBoundingClientRect().left;
		offsetY = touch.clientY - draggableElement.getBoundingClientRect().top;
		console.log(offsetY);
	}

	// Store the initial position of the element
	initialPositionX = parseInt(draggableElement.style.left) || 0;
	initialPositionY = parseInt(draggableElement.style.top) || 0;

	// Set the element's position to "fixed" so it can be dragged freely
	draggableElement.style.position = "fixed";
	draggableElement.style.zIndex = "1000";
}

function drag(e) {
	if (!isDragging) return;

	// Handle both mouse and touch events
	let clientX, clientY;
	if (e.type === "mousemove") {
		clientX = e.clientX;
		clientY = e.clientY;
	} else if (e.type === "touchmove") {
		const touch = e.touches[0];
		clientX = touch.clientX;
		clientY = touch.clientY;
	}

	// Calculate the new position of the element
	const newY = clientY - offsetY;
	const newX = clientX - offsetX;

	// Calculate the distance moved during this drag
	let distanceY = newY - initialPositionY;

	// Deduct the original elemtent distance from the top of the viewport
	if (distanceY === newY) {
		distanceY -= originalDistanceFromTop;
	}

	// Update the element's position based on the mouse/touch position and offset
	draggableElement.style.left = newX + "px";
	draggableElement.style.top = newY + "px";

	// Update the background position to move it together with the element
	body.style.backgroundPositionY = totalDistance + "px";

	// Update the total distance
	totalDistance += distanceY;
	distanceDisplay.textContent = totalDistance.toFixed(0);

	// Update the initial position for the next drag
	initialPositionY = newY;
}

function endDrag() {
	if (!isDragging) return;

	// Reset the element's position to "absolute" and return it to its original place
	draggableElement.style.position = "absolute";
	draggableElement.style.zIndex = "0";
	draggableElement.style.left = originalPositionX;
	draggableElement.style.top = originalPositionY;

	isDragging = false;
}
