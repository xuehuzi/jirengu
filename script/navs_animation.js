////nav列表鼠标移入移出事件
let li_tags = document.querySelectorAll('.top_nav_inner > nav > ul> li');
for (let i = 0; i < li_tags.length; i++) {//nav关于技能等子菜单显示关闭
    li_tags[i].onmouseenter = function (tag) {//添加li鼠标事件（放上）
        //console.log(li_tags[i])
        tag.currentTarget.classList.add('nav_list_show');
    };
    li_tags[i].onmouseleave = function (tag) {//添加li鼠标事件（离开）
        tag.currentTarget.classList.remove('nav_list_show');
    }
}

////nav列表点击后对应模块缓动事件
let a_tags = document.querySelectorAll('.top_nav_inner > nav > ul> li >a');//
for (let i = 0; i < a_tags.length; i++) {
    a_tags[i].onclick = function (tag) {
        tag.preventDefault();//阻止a标签默认的跳转
        let a_href = tag.currentTarget.getAttribute('href');
        //getAttribute获取到a标签的href是原本输入的，直接通过href获取的地址会经过浏览器转义
        let Jump_target = document.querySelector(a_href);
        let Jump_top = Jump_target.offsetTop;

        /*
                    //原生无缓冲动画
                    let move_numbers = 25;
                    let d = 500 / move_numbers;
                    let move_flg = 0;
                    let currentTop = window.scrollY;//垂直方向已滚动的距离
                    let targetTop = Jump_top - 100;
                    let speed = (targetTop - currentTop) / move_numbers;//每次需要移动的距离
                    let move_timer = setInterval(function () {
                        if (move_flg === move_numbers) {//达到移动次数清除定时器
                            clearInterval(move_timer);
                            return
                        }
                        move_flg = move_flg + 1;
                        //console.log(speed)
                        window.scrollTo(0, currentTop + speed * move_flg);
                    }, d);

                    //tween第三方动画库
                    */
        let currentTop = window.scrollY;
        let targetTop = Jump_top - 100;
        //console.log(targetTop - currentTop);
        let s = targetTop - currentTop; // 路程
        let coords = {y: currentTop}; // 起始位置
        let t = Math.abs((s / 100) * 300); // 时间
        if (t > 500) {
            t = 500
        }
        var tween = new TWEEN.Tween(coords) // 起始位置
            .to({y: targetTop}, t) // 结束位置 和 时间
            .easing(TWEEN.Easing.Cubic.InOut) // 缓动类型
            .onUpdate(function () {
                // coords.y 已经变了
                window.scrollTo(0, coords.y) // 如何更新界面
            })
            .start(); // 开始缓动
    }
}