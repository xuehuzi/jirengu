/*function $(selector) {
    return document.querySelector(selector)
}

function $$(selector) {
    return document.querySelectorAll(selector)
}*/

class player {
    constructor(node) {
        this.root = typeof node === 'string' ? document.querySelector(node) : node;
        this.$ = selector => this.root.querySelector(selector);
        this.$$ = selector => this.root.querySelectorAll(selector);
        this.music_list = [];
        this.index = 0;
        this.start();
        this.audio = new Audio();
        this.bind();
        /*
        * 可理解为，DOM内的<audio id="audio"></audio>，这样写省去DOM内加东西
        * 为什么要写？浏览器会禁用自动播放，所以需要给播放按钮加事件
        * */

    }

    start() {
        fetch('https://jirengu.github.io/data-mock/huawei-music/music-list.json')
            .then(
                res => res.json()
                // (res) => {
                //     res.json()
                // }
            )
            .then(
                (data) => {
                    console.log(222222);
                    console.log(data);
                    this.music_list = data;
                    this.audio.src = this.music_list[this.index].url;
                }
            )
    }

    bind() {
        let that = this;
        this.root.querySelector('.icon-play').onclick = function () {
            //console.log(that.audio);
            if (this.classList.contains('playing')) {
                that.audio.pause();
                this.classList.remove('playing');
                this.classList.add('pause');
                this.querySelector('use').setAttribute('xlink:href', '#icon-play')
            } else {
                that.start_play();
                this.classList.remove('pause');
                this.classList.add('playing');
                this.querySelector('use').setAttribute('xlink:href', '#icon-pause')
            }
        };
        /*
        * >>>播放按钮功能
        * let that = this;需要绑定到当前点击的播放按钮
        * 下来根据播放按钮状态展示暂停还是播放中（DOM操作，修改SVG的类名）
        * */

        this.root.querySelector('.icon-pre').onclick = function () {//上一曲
            that.pre_song()
        };
        this.root.querySelector('.icon-next').onclick = function () {//下一曲
            that.next_song()
        };
        ////
        let cd = false;
        let intX;
        let newX;
        this.root.querySelector('.main').ontouchstart = function (e) {
            intX = e.changedTouches[0].pageX;
            //console.log(e);
        };
        this.root.querySelector('.main').ontouchmove = function (e) {
            newX = e.changedTouches[0].pageX;
            if (!cd) {//加了节流
                if (newX - intX > 0) {
                    this.classList.remove('main_2');
                    this.classList.add('main_1');
                    console.log('left')

                } else {
                    this.classList.remove('main_1');
                    this.classList.add('main_2');
                    console.log('right')
                }
                cd = true;
                setTimeout(() => {
                    cd = false;
                }, 500)
            }
        }
    }

    //
    start_play() {
        this.audio.oncanplaythrough = () => this.audio.play()
    }

    /*
    * 直接使用that.audio.play()会报错，具体原因待详细了解
    * */

    //
    pre_song() {
        this.index = (this.music_list.length + this.index - 1) % this.music_list.length;
        this.audio.src = this.music_list[this.index].url;
        this.audio.oncanplaythrough = () => {
            this.start_play();
        }
    }

    next_song() {
        this.index = (this.music_list.length + this.index + 1) % this.music_list.length;
        this.audio.src = this.music_list[this.index].url;
        this.audio.oncanplaythrough = () => {
            this.start_play();
        }
    }


}


new player('#player');
