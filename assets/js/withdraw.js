let reals    = document.querySelector(".reals");
let previous = new Map();
let next     = new Map();
let target   = document.querySelector("#left");
let config   = {attributes: true, childList: true, characterData: true, subtree: true};
let observer = new MutationObserver(function () {
    if (reals.textContent !== "") {
        if (previous.has("timestamp")) {
            if (next.has("timestamp")) {
                previous = next;
                next.clear();
                setTimestamp(next);
                fillMap(next);
            } else {
                setTimestamp(next);
                fillMap(next);
            }
        } else {
            setTimestamp(previous);
            fillMap(previous);
        }
    }
});

observer.observe(target, config);

function setTimestamp(map) {
    map.set("timestamp", new Date().getTime());
}

function fillMap(map) {
    for (let i = 0; i < reals.length; i++) {
        map.set(reals.childNodes[i].childNodes[0].getAttribute("data-pos"), reals.childNodes[i].childNodes[0].getAttribute("data-view"));
    }
}

