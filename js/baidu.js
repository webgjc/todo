function fuck_baidu_ad() {
    $('[data-tuiguang]').parents('[data-click]').remove();
    $(".ec_tuiguang_pplink").parent().parent().remove();
}
setInterval(fuck_baidu_ad, 500);