var sliderProps = {
	fill: "#0B1EDF",
	background: "rgba(255, 255, 255, 0.214)",
};

// Selecting the Range Slider container which will effect the LENGTH property of the password.
var slider = document.querySelector(".range__slider");

// Text which will show the value of the range slider.
var sliderValue = document.querySelector(".length__title");

// Using Event Listener to apply the fill and also change the value of the text.
slider.querySelector("input").addEventListener("input", event => {
	sliderValue.setAttribute("data-length", event.target.value);
	applyFill(event.target);
});
// Selecting the range input and passing it in the applyFill func.
applyFill(slider.querySelector("input"));
// This function is responsible to create the trailing color and setting the fill.
function applyFill(slider) {
	var percentage = (100 * (slider.value - slider.min)) / (slider.max - slider.min);
	var bg = `linear-gradient(90deg, ${sliderProps.fill} ${percentage}%, ${sliderProps.background} ${percentage +
			0.1}%)`;
	slider.style.background = bg;
	sliderValue.setAttribute("data-length", slider.value);
}

// Object of all the function names that we will use to create random letters of password
var randomFunc = {
	lower: getRandomLower,
	upper: getRandomUpper,
	number: getRandomNumber,
	symbol: getRandomSymbol,
};

// Random more secure value
function secureMathRandom() {
	return window.crypto.getRandomValues(new Uint32Array(1))[0] / (Math.pow(2, 32) - 1);
}

// Generator Functions
// All the functions that are responsible to return a random value taht we will use to create password.
function getRandomLower() {
	return String.fromCharCode(Math.floor(Math.random() * 26) + 97);
}
function getRandomUpper() {
	return String.fromCharCode(Math.floor(Math.random() * 26) + 65);
}
function getRandomNumber() {
	return String.fromCharCode(Math.floor(secureMathRandom() * 10) + 48);
}
function getRandomSymbol() {
	var symbols = '~!@#$%^&*()_+{}":?><;.,';
	return symbols[Math.floor(Math.random() * symbols.length)];
}

// Selecting all the DOM Elements that are necessary -->

// The Viewbox where the result will be shown
var resultEl = document.getElementById("result");
// The input slider, will use to change the length of the password
var lengthEl = document.getElementById("slider");

// Checkboxes representing the options that is responsible to create differnt type of password based on user
var uppercaseEl = document.getElementById("uppercase");
var lowercaseEl = document.getElementById("lowercase");
var numberEl = document.getElementById("number");
var symbolEl = document.getElementById("symbol");

// Button to generate the password
var generateBtn = document.getElementById("generate");
// Button to copy the text
var copyBtn = document.getElementById("copy-btn");
// Result viewbox container
var resultContainer = document.querySelector(".result");
// Text info showed after generate button is clicked
var copyInfo = document.querySelector(".result__info.right");
// Text appear after copy button is clicked
var copiedInfo = document.querySelector(".result__info.left");

// if this variable is trye only then the copyBtn will appear, i.e. when the user first click generate the copyBth will interact.
let generatedPassword = false;

// Update Css Props of the COPY button
// Getting the bounds of the result viewbox container
let resultContainerBound = {
	left: resultContainer.getBoundingClientRect().left,
	top: resultContainer.getBoundingClientRect().top,
};
// This will update the position of the copy button based on mouse Position
resultContainer.addEventListener("mousemove", e => {
	resultContainerBound = {
		left: resultContainer.getBoundingClientRect().left,
		top: resultContainer.getBoundingClientRect().top,
	};
	if(generatedPassword){
		copyBtn.style.opacity = '1';
		copyBtn.style.pointerEvents = 'all';
		copyBtn.style.setProperty("--x", `${e.x - resultContainerBound.left}px`);
		copyBtn.style.setProperty("--y", `${e.y - resultContainerBound.top}px`);
	}else{
		copyBtn.style.opacity = '0';
		copyBtn.style.pointerEvents = 'none';
	}
});
window.addEventListener("resize", e => {
	resultContainerBound = {
		left: resultContainer.getBoundingClientRect().left,
		top: resultContainer.getBoundingClientRect().top,
	};
});

// Copy Password in clipboard
copyBtn.addEventListener("click", () => {
	var textarea = document.createElement("textarea");
	var password = resultEl.innerText;
	if (!password || password == "CLICK GENERATE") {
		return;
	}
	textarea.value = password;
	document.body.appendChild(textarea);
	textarea.select();
	document.execCommand("copy");
	textarea.remove();

	copyInfo.style.transform = "translateY(200%)";
	copyInfo.style.opacity = "0";
	copiedInfo.style.transform = "translateY(0%)";
	copiedInfo.style.opacity = "0.75";
});

// When Generate is clicked Password id generated.
generateBtn.addEventListener("click", () => {
	var length = +lengthEl.value;
	var hasLower = lowercaseEl.checked;
	var hasUpper = uppercaseEl.checked;
	var hasNumber = numberEl.checked;
	var hasSymbol = symbolEl.checked;
	generatedPassword = true;
	resultEl.innerText = generatePassword(length, hasLower, hasUpper, hasNumber, hasSymbol);
	copyInfo.style.transform = "translateY(0%)";
	copyInfo.style.opacity = "0.75";
	copiedInfo.style.transform = "translateY(200%)";
	copiedInfo.style.opacity = "0";
});

// Function responsible to generate password and then returning it.
function generatePassword(length, lower, upper, number, symbol) {
	let generatedPassword = "";
	var typesCount = lower + upper + number + symbol;
	var typesArr = [{ lower }, { upper }, { number }, { symbol }].filter(item => Object.values(item)[0]);
	if (typesCount === 0) {
		return "";
	}
	for (let i = 0; i < length; i++) {
		typesArr.forEach(type => {
			var funcName = Object.keys(type)[0];
			generatedPassword += randomFunc[funcName]();
		});
	}
	return generatedPassword.slice(0, length);
}

// function that handles the checkboxes state, so at least one needs to be selected. The last checkbox will be disabled.
function disableOnlyCheckbox(){
	let totalChecked = [uppercaseEl, lowercaseEl, numberEl, symbolEl].filter(el => el.checked)
	totalChecked.forEach(el => {
		if(totalChecked.length == 1){
			el.disabled = true;
		}else{
			el.disabled = false;
		}
	})
}

[uppercaseEl, lowercaseEl, numberEl, symbolEl].forEach(el => {
	el.addEventListener('click', () => {
		disableOnlyCheckbox()
	})
})
