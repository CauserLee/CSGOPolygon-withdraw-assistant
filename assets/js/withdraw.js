let next = new Map();
let target = document.querySelector("#left .reals");
let config = {attributes: false, childList: true, characterData: true, subtree: true};
let observer = new MutationObserver(function () {
	if ($("#inlineAlert").hasClass("alert-success")) {
		if (sessionStorage.getItem("previous")) {
			let previous = new Map(JSON.parse(sessionStorage.getItem("previous")));//Convert the ES6 Map from an Array of pairs
			next.clear();
			fillMap(next);
			compareMap(previous, next);
			sessionStorage.setItem("previous", JSON.stringify([...next]));
			addListener();
			observer.disconnect();
		} else {
			let previous = new Map();
			fillMap(previous);
			sessionStorage.setItem("previous", JSON.stringify([...previous])); //[...previous]: Convert the ES6 Map to an Array of pairs
			observer.disconnect();
		}
	}
});

$(document).ready(function () {
	$(".fw-4").append("<div class='panel-body'>\n" +
		"<button class=\"btn btn-success btn-lg\" style=\"width:100%\">New Items<div style=\"font-size:12px\">Product By Arthur.Lee</div></button>\n" +
		"<div id='right-ext' class='slot-group noselect'>\n" +
		"<span id='right-ext-reals' class=\"reals\"></span>\n" +
		"<span class=\"bricks\">\n" +
		"<div class=\"placeholder\"></div>\n" +
		"<div class=\"placeholder\"></div>\n" +
		"<div class=\"placeholder\"></div>\n" +
		"<div class=\"placeholder\"></div>\n" +
		"<div class=\"placeholder\"></div>\n" +
		"<div class=\"placeholder\"></div>\n" +
		"<div class=\"placeholder\"></div>\n" +
		"<div class=\"placeholder\"></div>\n" +
		"</span>\n" +
		"</div>\n" +
		"</div>\n");
	observer.observe(target, config);
});

function fillMap(map) {
	for (let i = 0; i < target.childNodes.length; i++) {
		map.set(String(target.childNodes[i].childNodes[0].getAttribute("data-view")), String(target.childNodes[i].childNodes[0].getAttribute("data-pos")));
	}
}

function compareMap(previous, next) {
	let pool = new Set();
	for (let key of next.keys()) {
		if (!previous.has(key)) {
			pool.add(next.get(key));
		}
	}
	for (let i = 0; i < target.childNodes.length; i++) {
		if (pool.has(target.childNodes[i].childNodes[0].getAttribute("data-pos"))) {
			document.getElementById("right-ext-reals").appendChild(target.childNodes[i].cloneNode(true));
		}
	}
}

function addListener() {
	$(document).on("click", "#right-ext .slot:not(.reject)", function () {
		var b = $(this).data("bot") || null;
		if (b != null) {
			$("#botFilter .btn").removeClass("active").addClass("disabled");
			$("#botFilter .btn[data-bot='" + b + "']").addClass("active").removeClass("disabled");
			doFilter();
		}
		$("#right .reals").append("<div class='placeholder'></div>");
		$(this).appendTo($("#right .reals .placeholder:empty").first());
		addPadding("#right", 4);
		addUp();
	});
}

//imports
function doFilter() {
	var b = $("#botFilter .btn.active").data("bot") || 0;
	var t = $("#filter").val().toLowerCase();
	var total = $("#left .reals>.placeholder").length;
	var n = $("#left .reals>.placeholder").addClass("hidden").filter(function (i, e) {
		var bx = $(this).data("bot") || "";
		var tx = $(this).data("name") || "";
		var px = $(this).data("price") || 0;
		if (b == 0 || b == bx) {
			if (tx.toLowerCase().indexOf(t) >= 0) {
				return true;
			} else if (t.charAt(0) == ">") {
				return px > parseInt(t.substr(1));
			} else if (t.charAt(0) == ">") {
				return px < parseInt(t.substr(1));
			}
		}
	}).removeClass("hidden").length;
	if (t === "" && b == 0) {
		$("#left_number").html(total);
	} else {
		$("#left_number").html(n + "/" + total);
	}
	addPadding("#left", 6);
}

function addPadding(lr, across) {
	var MIN = 2;
	var count = $(lr + " .reals>.placeholder:not(.hidden)").length;
	var needed = 0;
	if (count <= across * MIN) {
		needed = across * MIN - count;
	} else {
		needed = (across - (count % across)) % across;
	}
	$(lr + " .bricks>.placeholder").addClass("hidden").slice(0, needed).removeClass("hidden");
}

function addUp() {
	var creds = 0;
	var count = 0;
	$("#right .slot").each(function (i, e) {
		creds += $(this).data("price");
		count++;
	});
	if (!DEPOSIT) {
		creds = -creds;
	}
	$("#sum").html(formatNum(creds));
	if (count == 0) {
		$("#botFilter .btn").removeClass("disabled");
	}
}