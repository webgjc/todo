new DateTime($("#new_date"));

var domDialog;
$('#add_btn').click(function() {
    if (domDialog) {
        domDialog.show();
    } else {
        domDialog = new Dialog({
            title: '添加任务/目标/完成时间',
            content: $('#add_form').show()
        });
    }
});


function init() {
    chrome.storage.local.get(["aim_list"], function(res) {
        if (res.aim_list != undefined) {
            refresh_list(res.aim_list);
        }
    });
}

function refresh_list(aim_list) {
    li_html = "<tr><th scope=\"col\">任务/目标</th><th scope=\"col\">完成时间</th><th scope=\"col\">操作</th></tr>";
    for (let i = 0; i < aim_list.length; i++) {
        if (aim_list[i]["state"] == 0) {
            li_html += "<tr><td>" + aim_list[i]["aim"] + "</td><td>" + aim_list[i]["date"] + "</td><td><a href='#' id='finish_" + i + "'>完成</a> <a href='#' id='del_" + i + "'>删除</a></td></tr>"
        } else {
            li_html += "<tr><td>" + aim_list[i]["aim"] + "</td><td>" + aim_list[i]["date"] + "</td><td><span class='finished'>已完成</span> <a href='#' id='del_" + i + "'>删除</a> </td></tr>"
        }
    }
    $("#aim_list").html(li_html);
}

$("#aim_list").delegate("a", "click", function() {
    operas = $(this).attr("id").split("_");
    if (operas[0] == "finish") {
        chrome.storage.local.get(["aim_list"], function(res) {
            res.aim_list[parseInt(operas[1])]["state"] = 1
            chrome.storage.local.set({ "aim_list": res.aim_list }, function() {
                refresh_list(res.aim_list)
            });
        });
    }
    if (operas[0] == "del") {
        chrome.storage.local.get(["aim_list"], function(res) {
            res.aim_list.splice(parseInt(operas[1]), 1)
            chrome.storage.local.set({ "aim_list": res.aim_list }, function() {
                refresh_list(res.aim_list)
            });
        });
    }
})


$("#sbt_btn").click(function(e) {
    e.preventDefault();
    chrome.storage.local.get(["aim_list"], function(res) {
        if (res.aim_list == undefined) {
            aim_list = [];
        } else {
            aim_list = res.aim_list;
        }
        sbt_data = {
            "aim": $("#new_aim").val(),
            "date": $("#new_date").val(),
            "state": 0
        }
        $("#new_aim").val("")
        $("#new_date").val("")
        aim_list.unshift(sbt_data);
        chrome.storage.local.set({ "aim_list": aim_list }, function() {
            refresh_list(aim_list);
        });
    })
    domDialog.hide();
});

init();

function make_pv_chart() {
    chrome.storage.local.get(["todo_urls"], function(res) {
        todo_urls = []
        for (let i in res.todo_urls) {
            todo_urls.push({
                url: i,
                pv: res.todo_urls[i]
            })
        }
        todo_urls.sort(function(a, b) { return b['pv'] < a['pv'] ? -1 : 1 });
        todo_urls = todo_urls.slice(0, 20);
        xAxis = []
        series = []
        for (let i = 0; i < todo_urls.length; i++) {
            xAxis.push(todo_urls[i]["url"])
            series.push(todo_urls[i]["pv"])
        }
        var myChart = echarts.init(document.getElementById('chart'));

        var chart_option = {
            title: {
                text: "访问次数统计"
            },
            tooltip: {},
            legend: {
                data: ["访问次数"]
            },
            grid: {
                y2: 140
            },
            xAxis: {
                data: xAxis,
                axisLabel: {
                    interval: 0,
                    rotate: "90"
                },
            },
            yAxis: {},
            series: [{
                name: "访问量",
                type: "bar",
                data: series,
                itemStyle: {
                    normal: {
                        color: "#4ad2ff"
                    }
                }
            }]
        }
        myChart.setOption(chart_option);
    })

}
make_pv_chart()

function make_view_chart() {
    chrome.storage.local.get(["todo_view_timer"], function(res) {
        // res.todo_view_timer
    })
}


function make_size_chart() {
    chrome.storage.local.get(["todo_resource_size"], function(res) {
        todo_resource_size = []
        for (let i in res.todo_resource_size) {
            todo_resource_size.push({
                url: i,
                size: res.todo_resource_size[i]
            })
        }
        todo_resource_size.sort(function(a, b) { return b['size'] < a['size'] ? -1 : 1 });
        todo_resource_size = todo_resource_size.slice(0, 20);
        xAxis = []
        series = []
        for (let i = 0; i < todo_resource_size.length; i++) {
            xAxis.push(todo_resource_size[i]["url"]);
            series.push(parseInt(todo_resource_size[i]["size"] / 1000));
        }
        var myChart = echarts.init(document.getElementById('size_chart'));

        var chart_option = {
            title: {
                text: "页面大小统计"
            },
            tooltip: {},
            legend: {
                data: ["加载总大小"]
            },
            grid: {
                y2: 140
            },
            xAxis: {
                data: xAxis,
                axisLabel: {
                    interval: 0,
                    rotate: "90"
                },
            },
            yAxis: {},
            series: [{
                name: "加载量",
                type: "bar",
                data: series,
                itemStyle: {
                    normal: {
                        color: "#4ad2ff"
                    }
                }
            }],
            tooltip: {
                formatter: function(data) {
                    return data.seriesName + '<br/>' + data.name + '：' + data.value + 'KB';
                }
            }
        }
        myChart.setOption(chart_option);
    })
}

make_size_chart()

function make_timer_chart() {
    chrome.storage.local.get(["todo_view_timer"], function(res) {
        todo_view_timer = []
        for (let i in res.todo_view_timer) {
            todo_view_timer.push({
                url: i,
                timer: res.todo_view_timer[i]
            })
        }
        todo_view_timer.sort(function(a, b) { return b['timer'] < a['timer'] ? -1 : 1 });
        todo_view_timer = todo_view_timer.slice(0, 20);
        xAxis = []
        series = []
        for (let i = 0; i < todo_view_timer.length; i++) {
            xAxis.push(todo_view_timer[i]["url"]);
            series.push(parseInt(todo_view_timer[i]["timer"] / 1000));
        }
        var myChart = echarts.init(document.getElementById('timer_chart'));
        var chart_option = {
            title: {
                text: "页面访问时间统计"
            },
            tooltip: {},
            legend: {
                data: ["访问时间"]
            },
            grid: {
                y2: 140
            },
            xAxis: {
                data: xAxis,
                axisLabel: {
                    interval: 0,
                    rotate: "90"
                },
            },
            yAxis: {},
            series: [{
                name: "访问时间",
                type: "bar",
                data: series,
                itemStyle: {
                    normal: {
                        color: "#4ad2ff"
                    }
                }
            }],
            tooltip: {
                formatter: function(data) {
                    if (data.value < 60) {
                        value = data.value + "秒";
                    } else if (data.value >= 60 && data.value < 3600) {
                        value = (data.value / 60).toFixed(3) + "分钟"
                    } else if (data.value >= 3600) {
                        value = (data.value / 3600).toFixed(3) + "小时"
                    }
                    return data.seriesName + '<br/>' + data.name + '：' + value;
                }
            }
        }
        myChart.setOption(chart_option);
    })
}
make_timer_chart()

// $("#clear_chart").click(function() {
//     var confirm_btn = $(this);
//     new Dialog().confirm('确定清空数据?', {
//         buttons: [{
//             events: function(event) {
//                 chrome.storage.local.set({ "todo_urls": {} });
//                 event.data.dialog.remove();
//             }
//         }, {}]
//     })
// })

// function get_music() {
//     var music_list_url = "http://m.kugou.com/zlist/list?listid=2&type=0&uid=668132723&sign=588497f559c65de2e406a95b227fc64b&_t=1563001403&pagesize=9999&json=&page=1&token=80aeff0b428c234f0e656c6908661ab20244f5100f1086da36dd2c66c426eebc"
//     $.get(music_list_url, function(data) {
//         data = JSON.parse(data);
//         chrome.storage.local.set({ "todo_music": data["list"]["info"] });
//     })
// }

// get_music()

// $("#insert_music").click(function() {
//     res = chrome.tabs.create({ url: "https://www.baidu.com" });
//     console.log(res)
// }

$("#clear_chart").click(function() {
    chrome.storage.local.set({ "todo_urls": {} })
})

$("#clear_size_chart").click(function() {
    chrome.storage.local.set({ "todo_resource_size": {} })
})

$("#clear_timer_chart").click(function() {
    chrome.storage.local.set({ "todo_view_timer": {} })
})

$("#day_clear").click(function() {
    if ($(this).prop('checked') == true) {
        chrome.storage.local.set({ "todo_day_clear": true })
    } else {
        chrome.storage.local.set({ "todo_day_clear": false })
    }
})

$(document).ready(function() {
    chrome.storage.local.get(["todo_day_clear"], function(res) {
        console.log(res.todo_day_clear)
        if (res.todo_day_clear == true) {
            $("#day_clear").prop('checked', true);
        }
    })
})