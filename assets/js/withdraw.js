let next     = new Map();
let target   = document.querySelector("#left .reals");
let config   = {attributes: false, childList: true, characterData: true, subtree: true};
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
    for (let key of previous.keys()) {
        if (!next.has(key)) {
            $("#right-ext-reals").append();
            //TODO:复制节点
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