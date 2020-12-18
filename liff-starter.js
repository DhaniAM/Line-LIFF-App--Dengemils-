/*
if on App => no Login, no Logout, yes Open in External Broswer

if on Desktop => yes Login, yes Logout, no Open in External Browser
*/

window.onload = function () {
	const useNodeJS = false; // if you are not using a node server, set this value to false
	const defaultLiffId = "1655372663-wW1AnGYe"; // change the default LIFF value if you are not using a node server

	// DO NOT CHANGE THIS
	let myLiffId = "";

	// if node is used, fetch the environment variable and pass it to the LIFF method
	// otherwise, pass defaultLiffId
	if (useNodeJS) {
		fetch("/send-id")
			.then(function (reqResponse) {
				return reqResponse.json();
			})
			.then(function (jsonResponse) {
				myLiffId = jsonResponse.id;
				initializeLiffOrDie(myLiffId);
			})
			.catch(function (error) {
				document
					.getElementById("liffAppContent")
					.classList.add("hidden");
				document
					.getElementById("nodeLiffIdErrorMessage")
					.classList.remove("hidden");
			});
	} else {
		myLiffId = defaultLiffId;
		initializeLiffOrDie(myLiffId);
	}
};

/**
 * Check if myLiffId is null. If null do not initiate liff.
 * @param {string} myLiffId The LIFF ID of the selected element
 */
function initializeLiffOrDie(myLiffId) {
	if (!myLiffId) {
		document
			.getElementById("liffAppContent")
			.classList.add("hidden");
		document
			.getElementById("liffIdErrorMessage")
			.classList.remove("hidden");
	} else {
		initializeLiff(myLiffId);
	}
}

/**
 * Initialize LIFF
 * @param {string} myLiffId The LIFF ID of the selected element
 */
function initializeLiff(myLiffId) {
	liff.init({
		liffId: myLiffId,
	})
		.then(() => {
			// start to use LIFF's api
			initializeApp();
		})
		.catch(err => {
			document
				.getElementById("liffAppContent")
				.classList.add("hidden");
			document
				.getElementById("liffInitErrorMessage")
				.classList.remove("hidden");
			console.log(err);
		});
}

/**
 * Initialize the app by calling functions handling individual app components
 */
function initializeApp() {
	registerButtonHandlers();
	getUserProfile();
	// If on App
	if (liff.isInClient()) {
	} else {
		// If on Web
		if (liff.isLoggedIn()) {
			document
				.getElementById("external-browser")
				.classList.toggle("hidden"); //hidden
			document
				.getElementById("liffLogoutButton")
				.classList.toggle("hidden"); //show
		} else {
			// not Log in on Web
			document
				.getElementById("login-menu")
				.classList.toggle("hidden"); //show
			document
				.getElementById("order-app")
				.classList.toggle("hidden"); //hidden
		}
	}
}

function getUserProfile() {
	liff.getProfile()
		.then(profile => {
			const name = profile.displayName;
			const image = profile.pictureUrl;

			document.querySelector(".user-name").innerHTML = name;
			document.querySelector(
				".user-img"
			).style.backgroundImage = `url(${image})`;
		})
		.catch(err => {
			console.log("error", err);
		});
}

function registerButtonHandlers() {
	document
		.getElementById("external-browser")
		.addEventListener("click", function () {
			liff.openWindow({
				url: "https://liff.line.me/1655372663-wW1AnGYe", // Isi dengan Endpoint URL aplikasi web Anda
				external: true,
			});
		});

	document
		.getElementById("liffLoginButton")
		.addEventListener("click", function () {
			if (!liff.isLoggedIn()) {
				liff.login();
			}
		});

	document
		.getElementById("liffLogoutButton")
		.addEventListener("click", function () {
			if (liff.isLoggedIn()) {
				liff.logout();
				window.location.reload();
			}
		});

	// Send Message to User
	document
		.getElementById("order")
		.addEventListener("click", function () {
			let orderMsg = orders
				.filter(order => order != "")
				.map(order => order.name + " " + order.value + "x")
				.join(", ");
			console.log(`Terimakasih telah menggunakan layanan kami, pesanan anda: ${orderMsg}. 
            Total harga: Rp${grandTotal}`);
			if (!liff.isInClient()) {
				sendAlertIfNotInClient();
			} else {
				liff.sendMessages([
					{
						type: "text",
						text: `Terimakasih telah menggunakan layanan kami, pesanan anda: ${orderMsg}. Total harga: Rp${grandTotal}`,
					},
				])
					.then(function () {
						window.alert(
							"Silahkan ditunggu pesanan anda"
						);
					})
					.catch(function (error) {
						window.alert(
							"Error sending message: " + error
						);
					});
			}
		});
}

function sendAlertIfNotInClient() {
	alert(
		"Can't order outside Line App, please use Line App."
	);
}
