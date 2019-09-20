(function () {
    console.log(3333);
}());

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
            }
            else {
                that.audio.play();
                this.classList.remove('pause');
                this.classList.add('playing');
                this.querySelector('use').setAttribute('xlink:href', '#icon-pause')
            }
        }
    }

    palysong() {
        this.audio.play()
    }
}


new player('#player');
