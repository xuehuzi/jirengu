function writ_code(target_node, target_code, fn) {
    let flg = 0;
    target_node.classList.add('code_display')//
    let timer = setInterval(() => {
        flg += 1;
        target_node.innerHTML = target_code.substring(0, flg);
        target_node.innerHTML = target_node.innerHTML.replace('#code', '<span style="color:red">code</span>');
        styleid.innerHTML = target_code.substring(0, flg);
        loading_animation.scrollTop = loading_animation.scrollHeight;
        if (flg >= str.length) {
            clearInterval(timer);
            fn && fn.call();
            target_node.classList.remove('code_display')//
        }
    }, 10);
}