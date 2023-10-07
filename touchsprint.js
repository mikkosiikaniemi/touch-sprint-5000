const finger1 = document.getElementById("finger-left");
const finger2 = document.getElementById("finger-right");
const body = document.body;
const distanceDisplay = document.getElementById("distance");

const originalPositionY1 = finger1.style.top;
const originalPositionX1 = finger1.style.left;
const originalPositionY2 = finger2.style.top;
const originalPositionX2 = finger2.style.left;
const originalDistanceFromTop1 = finger1.offsetTop;
const originalDistanceFromTop2 = finger2.offsetTop;

let isDragging1 = false;
let isDragging2 = false;
let offsetX1, offsetY1;
let offsetX2, offsetY2;
let initialPositionX1, initialPositionY1;
let initialPositionX2, initialPositionY2;
let totalDistance = 0;

// Add mouse and touch event listeners
finger1.addEventListener("mousedown", startDrag1);
finger1.addEventListener("touchstart", startDrag1);
finger2.addEventListener("mousedown", startDrag2);
finger2.addEventListener("touchstart", startDrag2);

document.addEventListener("mousemove", drag);
document.addEventListener("touchmove", drag);

document.addEventListener("mouseup", endDrag);
document.addEventListener("touchend", endDrag);

document.addEventListener('touchmove', function (event) {
	if (event.scale !== 1) { event.preventDefault(); }
}, { passive: false });

function startDrag1(e) {
	console.log('Dragging 1.')
	isDragging1 = true;

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

function startDrag2(e) {
	isDragging2 = true;

	// Handle both mouse and touch events
	if (e.type === "mousedown") {
		offsetX2 = e.clientX - finger2.getBoundingClientRect().left;
		offsetY2 = e.clientY - finger2.getBoundingClientRect().top;
	} else if (e.type === "touchstart") {
		const touch = e.touches[0];
		offsetX2 = touch.clientX - finger2.getBoundingClientRect().left;
		offsetY2 = touch.clientY - finger2.getBoundingClientRect().top;
	}

	// Store the initial position of the element
	initialPositionX2 = parseInt(finger2.style.left) || 0;
	initialPositionY2 = parseInt(finger2.style.top) || 0;

	// Set the element's position to "fixed" so it can be dragged freely
	finger2.style.position = "fixed";
	finger2.style.zIndex = "1000";
}

function drag(e) {
	if (isDragging1 || isDragging2) {

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

		// Calculate the new position and distance for draggableElement1
		if (isDragging1) {
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
			totalDistance += distanceY1;

			initialPositionY1 = newY1;
		}

		// Calculate the new position and distance for draggableElement1
		if (isDragging2) {
			const newY2 = clientY - offsetY2;
			const newX2 = clientX - offsetX2;

			// Calculate the distance moved during this drag
			let distanceY2 = newY2 - initialPositionY2;

			// Deduct the original elemtent distance from the top of the viewport
			if (distanceY2 === newY2) {
				distanceY2 -= originalDistanceFromTop2;
			}

			// Update the element's position based on the mouse/touch position and offset
			finger2.style.left = newX2 + "px";
			finger2.style.top = newY2 + "px";

			// Update the total distance
			totalDistance += distanceY2;

			initialPositionY2 = newY2;
		}

		// Update the background position to move it together with the element
		body.style.backgroundPositionY = totalDistance + "px";

		distanceDisplay.textContent = totalDistance.toFixed(0);

		// Update the initial position for the next drag


	}
}

function endDrag() {
	if (isDragging1) {

		// Reset the element's position to "absolute" and return it to its original place
		finger1.style.position = "absolute";
		finger1.style.zIndex = "0";
		finger1.style.left = originalPositionX1;
		finger1.style.top = originalPositionY1;

		isDragging1 = false;
	}

	if (isDragging2) {

		// Reset the element's position to "absolute" and return it to its original place
		finger2.style.position = "absolute";
		finger2.style.zIndex = "0";
		finger2.style.left = originalPositionX2;
		finger2.style.top = originalPositionY2;

		isDragging2 = false;
	}
}
