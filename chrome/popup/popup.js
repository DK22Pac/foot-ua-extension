//
// FOOTBALL.UA Extension
// https://github.com/DK22Pac/foot-ua-extension
//

function switch_comments_options() {
    var disable = !document.getElementById("ccnews").checked;
    document.getElementById("ccmatch").disabled = disable;
    document.getElementById("cicon").disabled = disable;
    document.getElementById("hoticon").disabled = disable;
    document.getElementById("cccol").disabled = disable;
    if (disable) {
        document.getElementById("ciconsymbol").disabled = disable;
        document.getElementById("ciconcol").disabled = disable;
        document.getElementById("hotsymbol").disabled = true;
        document.getElementById("hotcol").disabled = true;
        document.getElementById("hotcount").disabled = true;
    }
    else {
        switch_commenticon();
        switch_hoticon();
    }
}

function switch_commenticon() {
    var disabled = !document.getElementById("cicon").checked;
    document.getElementById("ciconsymbol").disabled = disabled;
    document.getElementById("ciconcol").disabled = disabled;
}

function switch_hoticon() {
    var disabled = !document.getElementById("hoticon").checked;
    document.getElementById("hotsymbol").disabled = disabled;
    document.getElementById("hotcol").disabled = disabled;
    document.getElementById("hotcount").disabled = disabled;
}

function save_options() {
    var cllinks = document.getElementById("cllinks").checked;
    var islinks = document.getElementById("islinks").checked;
    var islogo = document.getElementById("islogo").checked;
    var ccnews = document.getElementById("ccnews").checked;
    var ccmatch = document.getElementById("ccmatch").checked;
    var cicon = document.getElementById("cicon").checked;
    var ciconsymbol = document.getElementById("ciconsymbol").value;
    var ciconcol = document.getElementById("ciconcol").value;
    var hoticon = document.getElementById("hoticon").checked;
    var hotsymbol = document.getElementById("hotsymbol").value;
    var hotcol = document.getElementById("hotcol").value;
    var hotcount = document.getElementById("hotcount").value;
    var cccol = document.getElementById("cccol").value;
    var compicons = document.getElementById("compicons").checked;
    
    chrome.storage.sync.set({
        cllinks: cllinks,
        islinks: islinks,
        islogo: islogo,
        ccnews: ccnews,
        ccmatch: ccmatch,
        cicon: cicon,
        ciconsymbol: ciconsymbol,
        ciconcol: ciconcol,
        hoticon: hoticon,
        hotsymbol: hotsymbol,
        hotcol: hotcol,
        hotcount: hotcount,
        cccol: cccol,
        compicons: compicons
    });
    chrome.tabs.query({
        active: true,
        currentWindow: true
    }, function(tabs) {
        if (tabs[0].url == null || tabs[0].url.substr(8).startsWith("football.ua"))
            chrome.tabs.reload();
    });
}

function open_github_link() {
    chrome.tabs.create({url:"https://github.com/DK22Pac/foot-ua-extension"});
}

function on_loaded() {
    chrome.storage.sync.get({
        cllinks: true,
        islinks: false,
        islogo: false,
        ccnews: true,
        ccmatch: true,
        cicon: true,
        ciconsymbol: "🗨",
        ciconcol: "#009933",
        hoticon: true,
        hotsymbol: "🔥",
        hotcol: "#ff8000",
        hotcount: "100",
        cccol: "#009933",
        compicons: true
    }, function(items) {
        document.getElementById("cllinks").checked = items.cllinks;
        document.getElementById("islinks").checked = items.islinks;
        document.getElementById("islogo").checked = items.islogo;
        document.getElementById("ccnews").checked = items.ccnews;
        document.getElementById("ccmatch").checked = items.ccmatch;
        document.getElementById("cicon").checked = items.cicon;
        document.getElementById("ciconsymbol").value = items.ciconsymbol;
        document.getElementById("ciconcol").value = items.ciconcol;
        document.getElementById("hoticon").checked = items.hoticon;
        document.getElementById("hotsymbol").value = items.hotsymbol;
        document.getElementById("hotcol").value = items.hotcol;
        document.getElementById("hotcount").value = items.hotcount;
        document.getElementById("cccol").value = items.cccol;
        document.getElementById("compicons").checked = items.compicons;
        switch_comments_options();
    });
    document.getElementById("github-link").addEventListener("click", open_github_link);
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
document.addEventListener("DOMContentLoaded", on_loaded);
document.getElementById("save").addEventListener("click", save_options);
document.getElementById("ccnews").addEventListener("click", switch_comments_options);
document.getElementById("cicon").addEventListener("click", switch_commenticon);
document.getElementById("hoticon").addEventListener("click", switch_hoticon);
