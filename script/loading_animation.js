writ_code(code, str, () => {
    set_loading.classList.add('loading');//
    remove();
});

function remove() {
    setTimeout(function () {
        set_loading.classList.remove('loading');//加载动画
        loading_animation.style.display = 'none';
        bdy.classList.remove('bdy');
        let signs_2 = document.querySelectorAll('[data_x]');
        for (let i = 0; i < signs_2.length; i++) {
            signs_2[i].classList.remove('offsittop');
        }
        scroll_move();
    }, 2000);
}