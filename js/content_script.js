var tipCount = 0;
// 简单的消息通知
function tip(info) {
    info = info || '';
    var ele = document.createElement('div');
    ele.className = 'chrome-plugin-simple-tip slideInLeft';
    ele.style.top = tipCount * 70 + 20 + 'px';
    ele.innerHTML = `<div>${info}</div>`;
    document.body.appendChild(ele);
    ele.classList.add('animated');
    tipCount++;
    setTimeout(() => {
        ele.style.top = '-100px';
        setTimeout(() => {
            ele.remove();
            tipCount--;
        }, 400);
    }, 3000);
}

chrome.storage.local.get(["todo_day_clear", "todo_day"], function(res) {
    today = new Date().getDate()
    if (res.todo_day_clear == true && res.todo_day != undefined && res.todo_day != today) {
        chrome.storage.local.set({ "todo_resource_size": {} })
        chrome.storage.local.set({ "todo_view_timer": {} })
        chrome.storage.local.set({ "todo_urls": {} })
        chrome.storage.local.set({ "todo_day": new Date().getDate() });
    }

})

chrome.storage.local.get(["aim_list"], function(res) {
    if (res.aim_list == undefined) {
        return
    }
    aim_list = res.aim_list.filter(function(x) { return x["state"] == 0 })
    if (aim_list.length > 0) {
        aim_list.sort(function(a, b) { return b['date'] < a['date'] ? 1 : -1 })
        tip("您将于" + aim_list[0]["date"] + "前完成" + aim_list[0]["aim"])
    }
})

// function set_resource() {
//     var rs = window.performance.getEntries().length;
//     chrome.storage.local.get(["todo_resource"], function(res) {
//         if (res.todo_resource == undefined) {
//             todo_resource = {};
//         } else {
//             todo_resource = res.todo_resource;
//         }
//         console.log(todo_resource);
//         for (let i = 0; i < rs; i++) {
//             item = window.performance.getEntries()[i]
//             if (todo_resource[item.initiatorType] == undefined) {
//                 todo_resource[item.initiatorType] = [];
//             }
//             todo_resource[item.initiatorType].push(item.name);
//         }
//         chrome.storage.local.set({ "todo_resource": todo_resource });
//     })
// }



function set_urls() {
    var url = window.location.href.split("/")[2];
    chrome.storage.local.get(["todo_urls"], function(res) {
        if (res.todo_urls == undefined) {
            todo_urls = {};
        } else {
            todo_urls = res.todo_urls
        }
        if (todo_urls[url] == undefined) {
            todo_urls[url] = 1;
        } else {
            todo_urls[url] = todo_urls[url] + 1;
        }
        chrome.storage.local.set({ "todo_urls": todo_urls });
    })
    return url
}
// chrome.storage.local.set({"todo_resource": {}});
// set_resource()
// set_urls();
var TODO_view_start = Date.now();
var TODO_url = window.location.href.split("/")[2];

document.addEventListener("visibilitychange", function() {
    var TODO_view_end;
    if (document.visibilityState == "hidden") {
        TODO_view_end = Date.now();
        chrome.storage.local.get(["todo_view_timer"], function(res) {
            if (res.todo_view_timer == undefined) {
                todo_view_timer = {}
            } else {
                todo_view_timer = res.todo_view_timer
            }
            if (todo_view_timer[TODO_url] == undefined) {
                todo_view_timer[TODO_url] = 0
            }
            todo_view_timer[TODO_url] += TODO_view_end - TODO_view_start
                // document.getElementsByTagName("title")[0].innerText = todo_view_timer[TODO_url]
            chrome.storage.local.set({ "todo_view_timer": todo_view_timer })
        })
    } else {
        TODO_view_start = Date.now();
    }
    // document.getElementsByTagName("title")[0].innerText = document.visibilityState;
})

window.onbeforeunload = function(e) {
    var TODO_view_end = Date.now();
    chrome.storage.local.get(["todo_view_timer"], function(res) {
        if (res.todo_view_timer == undefined) {
            todo_view_timer = {}
        } else {
            todo_view_timer = res.todo_view_timer
        }
        if (todo_view_timer[TODO_url] == undefined) {
            todo_view_timer[TODO_url] = 0
        }
        todo_view_timer[TODO_url] += TODO_view_end - TODO_view_start
        chrome.storage.local.set({ "todo_view_timer": todo_view_timer })
    })
    return null
}


function set_resource(size) {
    chrome.storage.local.get(["todo_resource_size"], function(res) {
        if (res.todo_resource_size == undefined) {
            todo_resource_size = {}
        } else {
            todo_resource_size = res.todo_resource_size
        }
        if (todo_resource_size[TODO_url] == undefined) {
            todo_resource_size[TODO_url] = size
        } else {
            todo_resource_size[TODO_url] = Math.max(todo_resource_size[TODO_url], size)
        }
        chrome.storage.local.set({ "todo_resource_size": todo_resource_size })
    })
}


window.onload = function() {
    resource = window.performance.getEntries();
    res = 0;
    for (let i = 0; i < resource.length; i++) {
        if (resource[i]["encodedBodySize"] != undefined) {
            res += resource[i]["encodedBodySize"];
        }
    }
    set_urls()
    set_resource(res)
}