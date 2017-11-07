let next             = new Map();
let target           = document.querySelector("#left .reals");
let targetRight      = document.querySelector("#right .reals");
let targetRightExt   = $("#right-ext .reals").get(0);
const config         = {attributes: false, childList: true, characterData: true, subtree: true};
let observer         = new MutationObserver(function () {
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
let observerRight    = new MutationObserver(function (mutationRecord) {
    let addedNode = mutationRecord[1].addedNodes[0];
    if ($(addedNode).hasClass("slot-right-ext")) {
        $(addedNode).on("click", function () {
            let parent  = $(this).parent();
            let pointer = $("#right-ext-reals").children("[data-pos='" + $(this).attr("data-pos") + "']");
            pointer.prepend(this);
            parent.remove();
            addPadding("#right", 4);
        });
    }
});
let observerRightExt = new MutationObserver(function (mutationRecord) {
    let addedNode = mutationRecord[1].addedNodes[0];
    if ($(addedNode).hasClass("slot-right-ext")) {
        $(addedNode).on("click", function () {
            $("#right .reals").append("<div class='placeholder placeholder-right-ext'></div>");
            $(this).appendTo($("#right .reals .placeholder-right-ext:empty").first());
        });
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
    observerRight.observe(targetRight, config);
    observerRightExt.observe(targetRightExt, config);
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
            $(target.childNodes[i]).addClass("placeholder-right-ext");
            document.getElementById("right-ext-reals").appendChild(target.childNodes[i].cloneNode(true));
        }
    }
}

//Click Event Listener
function addListener() {
    $(document).on("click", "#right-ext .slot:not(.reject)", function () {
        $("#right .reals").append("<div class='placeholder placeholder-right-ext'></div>");
        if (!$(this).hasClass("slot-right-ext")) {
            $(this).addClass("slot-right-ext");
        }
        $(this).removeClass("slot");
        $(this).appendTo($("#right .reals .placeholder-right-ext:empty").first());
        addPadding("#right", 4);
    });
}

//imports
function addPadding(lr, across) {
    let MIN    = 2;
    let count  = $(lr + " .reals>.placeholder:not(.hidden)").length;
    let needed = 0;
    if (count <= across * MIN) {
        needed = across * MIN - count;
    } else {
        needed = (across - (count % across)) % across;
    }
    $(lr + " .bricks>.placeholder").addClass("hidden").slice(0, needed).removeClass("hidden");
}
