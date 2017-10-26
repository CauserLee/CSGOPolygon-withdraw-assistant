let previous      = new Map();
let next          = new Map();
let alertBar      = document.querySelector("#inlineAlert");
let realsLeft     = document.querySelector("#left .reals");
let realsRightExt = document.querySelector(".fw-4");
let target        = document.querySelector("#left");
let config        = {attributes: false, childList: true, characterData: true, subtree: true};
let observer      = new MutationObserver(function () {
    if (alertBar.hasClass("alert-success")) {
        if (previous.has("timestamp")) {
            if (next.has("timestamp")) {
                previous = next;
                next.clear();
                setTimestamp(next);
                fillMap(next);
                compareMap(previous, next);
            } else {
                setTimestamp(next);
                fillMap(next);
                compareMap(previous, next);
            }
        } else {
            setTimestamp(previous);
            fillMap(previous);
        }
    }
});

realsRightExt.append("<div class='panel-body'>" +
    "<div id='right-ext' class='slot-group noselect'></div>" +
    "</div>");
observer.observe(target, config);

function setTimestamp(map) {
    map.set("timestamp", new Date().getTime());
}

function fillMap(map) {
    for (let i = 0; i < realsLeft.length; i++) {
        map.set(realsLeft.childNodes[i].childNodes[0].getAttribute("data-view"), realsLeft.childNodes[i].childNodes[0].getAttribute("data-pos"));
    }
}

function compareMap(previous, next) {
    for (let [key, value] of next.entries()) {
        if (!previous.has(key)) {
            let node = document.importNode(document.querySelector(''), true);
            document.getElementById("#right-ext").appendChild(node);
        }
    }
}