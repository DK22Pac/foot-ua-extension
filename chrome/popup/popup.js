function switch_comments_options() {
    var disable = !document.getElementById("ccnews").checked;
    document.getElementById("ccmatch").disabled = disable;
    document.getElementById("cicon").disabled = disable;
    document.getElementById("hoticon").disabled = disable;
    document.getElementById("cccol").disabled = disable;
    document.getElementById("ciconcol").disabled = disable;
    if (disable)
        document.getElementById("hotcount").disabled = true;
    else
        switch_hoticon();
}

function switch_hoticon() {
    document.getElementById("hotcount").disabled = !document.getElementById("hoticon").checked;
}

function save_options() {
    var cllinks = document.getElementById("cllinks").checked;
    var islinks = document.getElementById("islinks").checked;
    var islogo = document.getElementById("islogo").checked;
    var ccnews = document.getElementById("ccnews").checked;
    var ccmatch = document.getElementById("ccmatch").checked;
    var cicon = document.getElementById("cicon").checked;
    var hoticon = document.getElementById("hoticon").checked;
    var hotcount = document.getElementById("hotcount").value;
    var cccol = document.getElementById("cccol").value;
    var ciconcol = document.getElementById("ciconcol").value;
    var compicons = document.getElementById("compicons").checked;
    chrome.storage.sync.set({
        cllinks: cllinks,
        islinks: islinks,
        islogo: islogo,
        ccnews: ccnews,
        ccmatch: ccmatch,
        cicon: cicon,
        hoticon: hoticon,
        hotcount: hotcount,
        cccol: cccol,
        ciconcol: ciconcol,
        compicons: compicons
    });
    chrome.tabs.query({
        active: true,
        currentWindow: true
    }, function(tabs) {
        if (tabs[0].url.substr(7).startsWith("football.ua"))
            chrome.tabs.reload();
    });
}

function restore_options() {
    chrome.storage.sync.get({
        cllinks: true,
        islinks: false,
        islogo: false,
        ccnews: true,
        ccmatch: true,
        cicon: true,
        hoticon: true,
        hotcount: "100",
        cccol: "#009933",
        ciconcol: "#009933",
        compicons: true
    }, function(items) {
        document.getElementById("cllinks").checked = items.cllinks;
        document.getElementById("islinks").checked = items.islinks;
        document.getElementById("islogo").checked = items.islogo;
        document.getElementById("ccnews").checked = items.ccnews;
        document.getElementById("ccmatch").checked = items.ccmatch;
        document.getElementById("cicon").checked = items.cicon;
        document.getElementById("hoticon").checked = items.hoticon;
        document.getElementById("hotcount").value = items.hotcount;
        document.getElementById("cccol").value = items.cccol;
        document.getElementById("ciconcol").value = items.ciconcol;
        document.getElementById("compicons").checked = items.compicons;
        switch_comments_options();
    });
}

function localize() {
    var pages = document.getElementsByTagName('html');
    for (var p = 0; p < pages.length; p++) {
        var oldhtml = pages[p].innerHTML;
        var newhtml = oldhtml.replace(/__MSG_(\w+)__/g, function(match, v1) {
            return v1 ? chrome.i18n.getMessage(v1) : "";
        });
        pages[p].innerHTML = newhtml;
    }
}

localize();
document.addEventListener("DOMContentLoaded", restore_options);
document.getElementById("save").addEventListener("click", save_options);
document.getElementById("ccnews").addEventListener("click", switch_comments_options);
document.getElementById("hoticon").addEventListener("click", switch_hoticon);
