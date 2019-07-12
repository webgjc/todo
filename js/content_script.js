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

chrome.storage.local.get(["aim_list"], function(res) {
    aim_list = res.aim_list.filter(function(x) { return x["state"] == 0 })
    if (aim_list.length > 0) {
        aim_list.sort(function(a, b) { return b['date'] < a['date'] ? 1 : -1 })
        tip("您将于" + aim_list[0]["date"] + "前完成" + aim_list[0]["aim"])
    }
})

function set_resource() {
    var rs = window.performance.getEntries().length;
    chrome.storage.local.get(["todo_resource"], function(res) {
        if (res.todo_resource == undefined) {
            todo_resource = {};
        } else {
            todo_resource = res.todo_resource;
        }
        console.log(todo_resource);
        for (let i = 0; i < rs; i++) {
            item = window.performance.getEntries()[i]
            if (todo_resource[item.initiatorType] == undefined) {
                todo_resource[item.initiatorType] = [];
            }
            todo_resource[item.initiatorType].push(item.name);
        }
        chrome.storage.local.set({ "todo_resource": todo_resource });
    })
}

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
}
// chrome.storage.local.set({"todo_resource": {}});
// set_resource()
set_urls()

chrome.storage.local.get(["name"], function(res) {
    console.log(res.name)
})