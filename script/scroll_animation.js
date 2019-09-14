////滚动到对应模块时的动效
function scroll_move() {
    let signs = document.querySelectorAll('[data_x]');//选择所有包含data_x标记的标签
    let sign_index = 0;//设置默认从第几位开始
    for (let i = 1; i < signs.length; i++) {//求出几个目标元素，哪一个距离当前滚动距离最近
        if (Math.abs(signs[i].offsetTop - window.scrollY) < Math.abs(signs[sign_index].offsetTop - window.scrollY)) {
            sign_index = i;
        }
    }
    let current_id = signs[sign_index].id;//获取当前距离top最近元素的id【注意变量位置，放的地方不同执行结果有差异】
    let a = document.querySelector('a[href="#' + current_id + '"]');
    let li = a.parentNode;
    let select_son = li.parentNode.children;
    //选择所有li标签（说明：先选取li的父元素，再选择li父元素所有的子元素，此时选取的子元素也包括li自己）
    for (let i = 0; i < select_son.length; i++) {//先清除所有，已有下划线的状态,然后给距离最近的那个元素加上样式
        select_son[i].classList.remove('active')
    }
    li.classList.add('active');

    let skill_bar = document.getElementsByClassName('skill_bar');
    for (let i = 0; i < skill_bar.length; i++) {
        if (sign_index === 1) {
            skill_bar[i].classList.add('skill_bar11')
        }
    }

    ////浏览到对应模块时给nav列表对应的标签加选中下划线
    /*
    * 选出标签（通过给对应的标签加data_x来标记）
    * 遍历当前正在聚焦浏览的标签
    * 遍历取消所有nav的下划线类
    * 给当前浏览（距离最近）的那个元素加上样式
    */
    signs[sign_index].classList.add('offsittop');
}

////nav根据滚动条是否滚动（scrollY）显示的动画
window.onscroll = function () {
    //console.log(window.scrollY);
    if (window.scrollY > 0) {
        top_nav.classList.add('top_nav_bg');
    } else {
        top_nav.classList.remove('top_nav_bg');
    }
    scroll_move();
};