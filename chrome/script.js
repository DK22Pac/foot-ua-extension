//
// FOOTBALL.UA Extension
// https://github.com/DK22Pac/foot-ua-extension
//

function replace_cl_link_with_normal_one(elem, link) {
    var link_comps = link.split("/"); // get link 'category' ('news', 'game' or 'galleries')
    if (link_comps.length < 5) // https://champions.football.ua/category/id
        return;
    var can_translate = false; // can we translate this link?
    switch (link_comps[3]) { // 'category' name
        case "news": // news (regular articles) and videos
        case "preview": // preview
            link_comps[3] = "uefa";
            can_translate = true;
            break;
        case "game": // match pages
            can_translate = true;
            break;
        case "galleries": // photos
            link_comps[3] = "gallery";
            can_translate = true;
            break;
    }
    if (can_translate) {
        link_comps[2] = "football.ua"; // replace 'champions.football.ua' with 'football.ua'
        elem.setAttribute("href", link_comps.join('/'));
    }
}

function replace_euro2020_link_with_normal_one(elem, link) {
    var link_comps = link.split("/"); // get link 'category' ('news', 'games' or 'video')
    if (link_comps.length == 6) { // https://football.ua/euro2020/game/id.html
        if (link_comps[4] == "game")
            elem.setAttribute("href", link_comps[0] + "//football.ua/germany/game/" + link_comps[5]);
    }
    else if (link_comps.length == 5) // https://football.ua/euro2020/id-title.html
        elem.setAttribute("href", link_comps[0] + "//football.ua/uefa/" + link_comps[4]);
    else if (link_comps.length == 4) { // https://football.ua/default.aspx?menu_id=football_matchcenter&game_id=id
        var idIndex = link_comps[3].indexOf("game_id=");
        if (idIndex != -1) {
            var gameId = parseInt(link_comps[3].substr(idIndex + 8));
            if (!isNaN(gameId))
                elem.setAttribute("href", link_comps[0] + "//football.ua/germany/game/" + gameId + ".html");
        }
    }
}

function parent(elem, level) {
    var result = elem.parentElement;
    while (level != 0) {
        result = result.parentElement;
        level--;
    }
    return result;
}

function parentTag(elem, level) {
    return parent(elem, level).tagName.toLowerCase();
}

function parentClass(elem, level) {
    return parent(elem, level).className.toLowerCase();
}

// -1 - can't display, 0 - regular, 1 - regular match, 2 - match centre
function get_display_comment_type(e, options) {
    if (parentTag(e, 0) == "li" && parentTag(e, 1) == "ul" && parentClass(e, 2).startsWith("news-feed"))
        return 0;
    else if (parentTag(e, 0) == "h3") {
        if (parentTag(e, 1) == "div" && parentClass(e, 2) == "main-article")
            return 0;
        else if (parentClass(e, 1) == "news-block")
            return 0;
    }
    else if (parentTag(e, 0) == "h4") {
        if (parentTag(e, 1) == "li" && parentTag(e, 2) == "ul") {
            if (parentClass(e, 3) == "news-archive" || parentClass(e, 3) == "read-also" || parentClass(e, 3) == "home-video home-gallery" || parentClass(e, 3) == "home-photo right-gallery")
                return 0;
        }
        else if (parentTag(e, 1) == "div") {
            if (parentClass(e, 2) == "big-intro")
                return 0;
            else if (parentTag(e, 2) == "div" && parentTag(e, 3) == "div" && parentTag(e, 4) == "div" && parentTag(e, 5) == "div" && parentClass(e, 6) == "home-photo right-gallery")
                return 0;
        }
    }
    else if (options.ccmatch && parentClass(e, 0).startsWith("score")) {
        if (parentTag(e, 1) == "td" && parentTag(e, 2) == "tr" && parentTag(e, 3) == "tbody" && parentTag(e, 4) == "table")
            return 2;
        else if (parentTag(e, 1) == "tr" && parentTag(e, 2) == "tbody" && parentTag(e, 3) == "table")
            return 1;
    }
    return -1;
}

function add_comment_count(elem, options) {
    var display_type = get_display_comment_type(elem, options);
    if (display_type != -1) {
        var strid = ""; // id string
        var link_comps, itemId, commentType;
        var link = elem.getAttribute("href");
        if (link.startsWith("https://footballua.oll.tv/")) {
            link_comps = link.split("/"); // 'video' https://footballua.oll.tv/id.html (4) commentType=9
            if (link_comps.length == 4 && link_comps[3].endsWith(".html")) {
                commentType = 9;
                strid = link_comps[3];
            }
        }
        else if (link.startsWith("https://football.ua/")) {
            link_comps = link.split("/"); // 'game'    https://football.ua/category/game/id.html (6) commentType=2
                                          // 'article' https://football.ua/blog/category/id.html (6) commentType=1
                                          // 'news'    https://football.ua/category/id-name.html (5) commentType=1
                                          // 'game'    https://football.ua/games_online/id.html (5) commentType=2
                                          // 'game'    https://football.ua/game/id.html (5) commentType=2
                                          // 'gallery' https://football.ua/gallery/id.html (5) commentType=4
                                          // 'turkish' https://football.ua/default.aspx...game_id=id (4) commentType=2
            if (link_comps.length == 6 && link_comps[5].endsWith(".html")) {
                strid = link_comps[5];
                if (options.ccmatch && link_comps[4] == "game")
                    commentType = 2;
                else if (link_comps[5].indexOf('-') != -1)
                    commentType = 1;
                else
                    strid = "";
            }
            else if (link_comps.length == 5 && link_comps[4].endsWith(".html")) {
                strid = link_comps[4];
                if (options.ccmatch && (link_comps[3] == "games_online" || link_comps[3] == "game"))
                    commentType = 2;
                else if (link_comps[3] == "gallery")
                    commentType = 4;
                else if (link_comps[4].indexOf('-') != -1)
                    commentType = 1;
                else
                    strid = "";
            }
            else if (options.ccmatch && link_comps.length == 4 && link_comps[3].startsWith("default.aspx")) {
                var gameIdPos = link_comps[3].indexOf("game_id=");
                if (gameIdPos != -1) {
                    strid = link_comps[3].substr(gameIdPos + 8);
                    commentType = 2;
                }
            }
        }
        if (strid != "") {
            var id = parseInt(strid, 10);
            if (!isNaN(id)) {
                var url = "https://services.football.ua/api/Comment/Comments?itemId=" + id + "&commentType=" + commentType + "&pageIndex=0&pageSize=25&sort=0&anchor=&callback=_jqjsp";
                var xhr = new XMLHttpRequest();
                xhr.open("GET", url, true);
                xhr.timeout = 30000;
                xhr.onreadystatechange = function() {
                    if (xhr.readyState != 4)
                        return;
                    if (xhr.status == 200) {
                        var countTextPos = xhr.responseText.indexOf("\"TotalCount\":");
                        if (countTextPos != -1) {
                            var totalCount = parseInt(xhr.responseText.substr(countTextPos + 13, 9), 10);
                            if (display_type == 1 || display_type == 2) {
                                if (commentType == 2) {
                                    var table = parent(elem, display_type + 2);
                                    var header = table.getElementsByTagName("th");
                                    for (var hi = 0; hi < header.length; hi++) {
                                        if (header[hi].colSpan == 4)
                                            header[hi].colSpan = 5;
                                    }
                                    var row = parent(elem, display_type);
                                    var match_block = "<td";
                                    if (totalCount != 0)
                                        match_block += " style=\"padding-right: 5px; text-align: right\"";
                                    match_block += ">";
                                    if (totalCount != 0) {
                                        if (options.cicon)
                                            match_block += "<font color=" + options.ciconcol + ">" + options.ciconsymbol + "</font>&nbsp";
                                        match_block += "<font color=" + options.cccol + ">" + totalCount + "</font>";
                                    }
                                    match_block += "</td>";
                                    row.innerHTML = row.innerHTML + match_block;
                                }
                            }
                            else if (commentType != 2 && totalCount != 0) {
                                var regular_block = "&nbsp";
                                if (options.cicon)
                                    regular_block += "<font color=" + options.ciconcol + ">" + options.ciconsymbol + "</font>&nbsp";
                                else
                                    regular_block += "&nbsp";
                                regular_block += "<font color=" + options.cccol + ">" + totalCount + "</font>";
                                if (options.hoticon && totalCount >= options.hotcount)
                                    regular_block += "&nbsp<font color=" + options.hotcol + ">" + options.hotsymbol + "</font>";
                                elem.innerHTML += regular_block;
                            }
                        }
                    }
                };
                xhr.send();
            }
        }
    }
}

function process_links_for_element(root, isslider, options) {
    var elems = root.getElementsByTagName("a");
    for (var e = 0; e < elems.length; e++) {
        var link = elems[e].getAttribute("href");
        if (link != null) {
            if (options.cllinks) {
                if (link.startsWith("https://champions.football.ua/"))
                    replace_cl_link_with_normal_one(elems[e], link);
                else if (link.startsWith("https://football.ua/euro2020/"))
                    replace_euro2020_link_with_normal_one(elems[e], link);
            }
            if (!isslider && options.ccnews)
                add_comment_count(elems[e], options);
        }
    }
}

function process_competition_logo(elem) {
    var imgname = "";
    var title = elem.innerHTML.toLowerCase();
    if (title == "лига чемпионов")
        imgname = "cl";
    else if (title == "лига европы")
        imgname = "el";
    else if (title.startsWith("италия.") || title == "кубок италии" || title == "суперкубок италии")
        imgname = "ita";
    else if (title.startsWith("франция.") || title == "кубок франции" || title == "суперкубок франции")
        imgname = "fra";
    else if (title.startsWith("англия.") || title.startsWith("кубок англи") || title == "кубок лиги" || title == "суперкубок англии")
        imgname = "eng";
    else if (title.startsWith("германия.") || title == "кубок германии" || title == "суперкубок германии")
        imgname = "deu";
    else if (title.startsWith("испания.") || title == "кубок испании" || title == "суперкубок испании")
        imgname = "esp";
    else if (title.startsWith("португалия.") || title == "кубок португалии" || title == "кубок португальской лиги" || title == "суперкубок португалии")
        imgname = "prt";
    else if (title.startsWith("турция.") || title == "кубок турции" || title == "суперкубок турции")
        imgname = "tur";
    else if (title.startsWith("украина.") || title == "кубок украины" || title == "суперкубок украины")
        imgname = "ukr";
    else if (title.startsWith("нидерланды.") || title == "кубок нидерландов" || title == "суперкубок нидерландов")
        imgname = "nld";
    else if  (title.startsWith("чемпионат европы") || title == "лига наций" || title == "суперкубок уефа")
        imgname = "uefa";
    else if (title == "чемпионат мира" || title == "кубок конфедераций" || title.startsWith("отбор на ЧМ") || title == "клубный чемпионат мира")
        imgname = "fifa";
    else if (title == "международный кубок чемпионов")
        imgname = "icc";
    else if (title == "кубок азии")
        imgname = "afc";
    else if (title == "юношеская лига уефа")
        imgname = "youth";
    if (imgname != "") {
        var imglink = chrome.extension.getURL("images/tournament/" + imgname + ".png");
        elem.innerHTML = "<img src=\"" + imglink + "\" height=" + 14 + "px style=\"display:inline\">&nbsp&nbsp" + elem.innerHTML;
    }
}

(function() {
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
    }, function(options) {
        process_links_for_element(document, false, options);
        document.addEventListener('click', function(elem) {
            elem = elem || window.event;
            var target = elem.target || elem.srcElement;
            if (target.className == "bx-prev" || target.className == "bx-next") {
                var matches_slider = document.getElementsByClassName("matches-slider");
                if (matches_slider.length > 0)
                    process_links_for_element(matches_slider[0], true, options);
                if (options.compicons) {
                    var mcompetitions = document.getElementsByClassName("match-header");
                    for (var mcm = 0; mcm < mcompetitions.length; mcm++)
                        process_competition_logo(mcompetitions[mcm]);
                }
            }
        }, false);
        if (options.compicons) {
            var competitions = document.getElementsByClassName("match-header");
            for (var cm = 0; cm < competitions.length; cm++)
                process_competition_logo(competitions[cm]);
        }
        if (options.islogo) {
            var isport_logo = document.getElementsByClassName("isport-link");
            if (isport_logo.length > 0) {
                if (isport_logo[0].parentNode.className == "li")
                    isport_logo[0].parentNode.parentNode.removeChild(isport_logo[0].parentNode);
                else
                    isport_logo[0].parentNode.removeChild(isport_logo[0]);
            }
        }
        if (options.islinks) {
            var isport_news = document.getElementsByClassName("isportNews");
            while(isport_news[0])
                isport_news[0].parentNode.removeChild(isport_news[0]);
        }
    });
})();
