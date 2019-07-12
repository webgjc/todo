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
        todo_urls = todo_urls.slice(0, 15);
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
                        color: '#4ad2ff'
                    }
                }
            }]
        }
        myChart.setOption(chart_option);
    })

}
make_pv_chart()