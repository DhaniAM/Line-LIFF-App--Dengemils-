const userImg = document.querySelector(".user-img");
const userName = document.querySelector(".user-name");

const inputs = document.querySelectorAll("input");
const pluss = document.querySelectorAll(".plus");
const minuss = document.querySelectorAll(".min");

const resultMenu = document.querySelector(".result-menu");
const resultPrice = document.querySelector(".result-price");

const menus = [
	{ name: "Serabi", price: 10000 },
	{ name: "Kimbap", price: 15000 },
	{ name: "Dessert Box", price: 30000 },
	{ name: "Brownies", price: 40000 },
	{ name: "Jus Jeruk", price: 5000 },
	{ name: "Teh Es", price: 2000 },
	{ name: "Air Mineral", price: 1000 },
	{ name: "Es Sirup", price: 4000 },
];

let counts = [0, 0, 0, 0, 0, 0, 0, 0];
let orders = ["", "", "", "", "", "", "", ""];
let grandTotal = 0;

// Plus Order
pluss.forEach((item, idx) => {
	item.addEventListener("click", e => {
		handleCount(e.target, idx);
		addValue();
		addResult(idx);
		totalResult(e.target, idx);
		checkNull();
	});
});

// Minus Order
minuss.forEach((item, idx) => {
	item.addEventListener("click", e => {
		totalResult(e.target, idx);
		handleCount(e.target, idx);
		addValue(e.target);
		minResult(idx);
		checkNull();
	});
});

function handleCount(target, idx) {
	if (target.textContent === "+") {
		counts[idx]++;
	} else {
		if (counts[idx] !== 0) {
			counts[idx]--;
		}
	}
}

// Add Counts Value
function addValue() {
	inputs.forEach((input, idx) => {
		input.value = counts[idx];
	});
}

// Result

// Add result Menu and it Counts
function addResult(idx) {
	// there should only 1 menu with the same name in result
	if (resultMenu.textContent.includes(menus[idx].name)) {
		const resultCount = document.querySelector(`.value${idx}`);
		resultCount.innerHTML = `x ${counts[idx]}`;
		const resultPrice = document.querySelector(`.price${idx}`);
		resultPrice.innerHTML =
			"Rp " + counts[idx] * menus[idx].price;
		orders[idx] = { name: menus[idx].name, value: counts[idx] };
	} else {
		// Add Menu to Result
		resultMenu.innerHTML += `<div class="result-menu-list m${idx} ${menus[idx].name}">${menus[idx].name}</div>`;
		resultMenu.innerHTML += `<div class="result-menu-list m${idx} value${idx}">x ${counts[idx]}</div>`;
		resultMenu.innerHTML += `<div class="result-menu-list m${idx} price${idx}">Rp ${menus[idx].price}</div>`;
		orders[idx] = { name: menus[idx].name, value: counts[idx] };
	}
}

// Minus result Menu and it Counts
function minResult(idx) {
	// Grab the Result
	const resultList = document.querySelectorAll(`.m${idx}`);
	const resultListValue = document.querySelector(`.value${idx}`);
	const resultListPrice = document.querySelector(`.price${idx}`);
	// Minus the Count and Price if not 0
	if (counts[idx] !== 0) {
		resultListValue.innerHTML = `x ${counts[idx]}`;
		resultListPrice.innerHTML =
			"Rp " + counts[idx] * menus[idx].price;
		orders[idx] = { name: menus[idx].name, value: counts[idx] };
	} else {
		// if 0, remove Menu from Result List
		resultList.forEach(list => {
			list.remove();
		});
		orders[idx] = "";
	}
}

// Add Total Result
function totalResult(target, idx) {
	if (target.textContent == "+") {
		grandTotal += menus[idx].price;
	} else if (
		target.textContent == "-" &&
		grandTotal != 0 &&
		counts[idx] != 0
	) {
		grandTotal -= menus[idx].price;
	}
	resultPrice.innerHTML = `Rp ${grandTotal}`;
}

// Show Modal
const iBtn = document.querySelectorAll(".iBtn");
const modalClass = [
	"md-serabi",
	"md-kimbap",
	"md-dessert",
	"md-brownies",
	"md-jus",
	"md-teh",
	"md-air",
	"md-sirup",
];
const modalParent = document.querySelector("#modal");
const modalParentWrap = document.querySelector(".md-wrap");
const close = document.querySelector(".fa");

iBtn.forEach((btn, idx) => {
	btn.addEventListener("click", () => {
		const iBtnClass = document.querySelector(
			`.${modalClass[idx]}`
		);
		iBtnClass.style.visibility = "visible";
		modalParent.style.visibility = "visible";
		modalParentWrap.style.visibility = "visible";
		close.addEventListener("click", () => {
			const iBtnClass = document.querySelector(
				`.${modalClass[idx]}`
			);
			iBtnClass.style.visibility = "hidden";
			modalParent.style.visibility = "hidden";
			modalParentWrap.style.visibility = "hidden";
		});
	});
});

// Order
const order = document.querySelector("#order");

function checkNull() {
	if (
		orders[1] == "" &&
		orders[0] == "" &&
		orders[2] == "" &&
		orders[3] == "" &&
		orders[4] == "" &&
		orders[5] == "" &&
		orders[6] == "" &&
		orders[7] == ""
	) {
		order.style.display = "none";
	} else {
		order.style.display = "inline";
	}
}
