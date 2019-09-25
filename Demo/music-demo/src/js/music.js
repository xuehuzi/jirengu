class player {
    constructor(node) {
        this.root = typeof node === 'string' ? document.querySelector(node) : node;
        //是字符串则获取DOM元素，是对象的话则直接当作对象对待
        this.$ = selector => this.root.querySelector(selector);
        this.$$ = selector => this.root.querySelectorAll(selector);
        this.music_list = [];
        this.music_index = 0;
        this.page_index = 0;
        this.start();
        this.audio = new Audio();
        //可理解为DOM内的<audio id="audio"></audio>，这样写省去DOM内加东西,因浏览器会禁用自动播放，所以需要给播放按钮加事件
        this.bind();
        /**/
        this.lyricsArr = [];
        this.lyricIndex = 0;//存歌词当前到第几行
        /**/
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
                    this.music_list = data;//获取音乐，将音乐放到music_list
                    this.rendering_music();
                }
            )
    }

    bind() {
        let that = this;
        this.$('.icon-play').onclick = function () {
            if (this.classList.contains('playing')) {
                that.audio.pause();
                this.classList.remove('playing');
                this.classList.add('pause');
                this.querySelector('use').setAttribute('xlink:href', '#icon-play')
            } else {
                that.audio.play();
                //that.start_play();
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
        this.$('.icon-pre').onclick = function () {//上一曲
            that.pre_song();
            that.rendering_music();
        };
        this.$('.icon-next').onclick = function () {//下一曲
            that.next_song();
            that.rendering_music();
        };
        /**/
        this.audio.ontimeupdate = function () {
            that.locateLyric();
            that.setProgerssBar();
        };
        /**/
        //
        let cd = false;
        let intX;
        let newX;
        this.$('.main').ontouchstart = function (e) {
            intX = e.changedTouches[0].pageX;
        };
        this.$('.main').ontouchmove = function (e) {//左右滑动
            newX = e.changedTouches[0].pageX;
            if (!cd) {//加了节流
                if (newX - intX > 0) {
                    this.classList.remove('main_2');
                    this.classList.add('main_1');
                    that.set_page_index();
                    that.set_spots('spots_selection');

                } else {
                    this.classList.remove('main_1');
                    this.classList.add('main_2');
                    that.set_page_index();
                    that.set_spots('spots_selection');
                }
                cd = true;
                setTimeout(() => {
                    cd = false;
                }, 500)
            }
        };
        //
    }

    pre_song() {
        this.music_index = (this.music_list.length + this.music_index - 1) % this.music_list.length;
        this.audio.src = this.music_list[this.music_index].url;
        this.audio.oncanplaythrough = () => {
            //this.start_play();
            this.reset_play_state();
            this.audio.play();
        }
    }

    next_song() {
        this.music_index = (this.music_list.length + this.music_index + 1) % this.music_list.length;
        this.audio.src = this.music_list[this.music_index].url;
        this.audio.oncanplaythrough = () => {
            //this.start_play();
            this.reset_play_state();
            this.audio.play();
        }
    }

    rendering_music() {//获取音乐对象（当前音乐的信息）
        let music_obj = this.music_list[this.music_index];
        this.$('.header h1').innerText = music_obj.title;
        this.$('.header p').innerText = music_obj.author + '_' + music_obj.albumn;
        this.audio.src = music_obj.url;
        /**/
        this.audio.onloadedmetadata = () => {
            //加载时就获取音乐的总时长
            this.$('.end_time').innerText = this.formateTime(this.audio.duration);
        };
        /**/
        this.loading_lyric();

    }

    set_spots(class_name) {//当前页面选中原点的状态
        let len = document.querySelectorAll('.spots>span');
        for (let i = 0; i < len.length; i++) {
            len[i].classList.remove(class_name);
        }
        len[this.page_index].classList.add(class_name);
    }

    set_page_index() {//获取当前页面切换在那一个
        this.$('.main').classList.forEach(
            (index) => {
                if (index === 'main_1') {
                    this.page_index = 0;
                } else if (index === 'main_2') {
                    this.page_index = 1;
                }

            }
        )
    }

    loading_lyric() {//加载歌词
        fetch(this.music_list[this.music_index].lyric)
            .then(
                res => res.json()
            )
            .then(
                (data) => {
                    /**/
                    this.setLyrics(data.lrc.lyric);
                    window.lyrics = data.lrc.lyric;
                    /**/
                }
            )
    }

    reset_play_state() {//重置播放按钮状态，解决点击上一首下一首按钮后播放按钮状态没变问题
        let play_state = this.$('.icon-play');
        play_state.classList.remove('pause');
        play_state.classList.add('playing');
        play_state.querySelector('use').setAttribute('xlink:href', '#icon-pause');
    }

    /**/
    setLyrics(lyrics) {//歌词拆分
        this.lyricIndex = 0;
        let fragment = document.createDocumentFragment();
        let lyricsArr = [];
        this.lyricsArr = lyricsArr;
        lyrics.split(/\n/)
            .filter(str => str.match(/\[.+?\]/))
            .forEach(line => {
                let str = line.replace(/\[.+?\]/g, '');
                line.match(/\[.+?\]/g).forEach(t => {
                    t = t.replace(/[\[\]]/g, '');
                    let milliseconds = parseInt(t.slice(0, 2)) * 60 * 1000 + parseInt(t.slice(3, 5)) * 1000 + parseInt(t.slice(6));
                    //milliseconds将歌词是时间转为毫秒
                    lyricsArr.push([milliseconds, str])
                })
            });

        lyricsArr.filter(line => line[1].trim() !== '').sort((v1, v2) => {
            if (v1[0] > v2[0]) {
                return 1
            } else {
                return -1
            }
        }).forEach(line => {
            let node = document.createElement('p');
            node.setAttribute('data-time', line[0]);
            node.innerText = line[1];
            fragment.appendChild(node)
        });
        this.$('.svg-lyrics .svg_lyrics_main').innerHTML = '';
        this.$('.svg-lyrics .svg_lyrics_main').appendChild(fragment)
    }

    locateLyric() {//定位播放界面歌词（根据播放时间定位到具体的DOM元素）
        if (this.lyricIndex < this.lyricsArr.length - 1) {
            //更改了原判断顺序，之前歌曲结束this.lyricsArr[this.lyricIndex + 1][0]会报错
            let currentTime = this.audio.currentTime * 1000;
            let nextLineTime = this.lyricsArr[this.lyricIndex + 1][0];
            if (currentTime > nextLineTime) {
                this.lyricIndex++;
                let node = this.$('[data-time="' + this.lyricsArr[this.lyricIndex][0] + '"]');
                if (node) this.setLyricToCenter(node);
                this.$$('.svg-list .lyric p')[0].innerText = this.lyricsArr[this.lyricIndex][1];
                this.$$('.svg-list .lyric p')[1].innerText = this.lyricsArr[this.lyricIndex + 1] ? this.lyricsArr[this.lyricIndex + 1][1] : '';
            }
        }
    }

    setLyricToCenter(node) {
        let translateY = node.offsetTop - this.$('.svg-lyrics').offsetHeight / 2;
        translateY = translateY > 0 ? translateY : 0;
        this.$('.svg-lyrics .svg_lyrics_main').style.transform = `translateY(-${translateY}px)`;
        this.$$('.svg-lyrics p').forEach(node => node.classList.remove('lyrics_flg'));
        node.classList.add('lyrics_flg')
    }


    setProgerssBar() {
        let percent = (this.audio.currentTime * 100 / this.audio.duration) + '%';
        this.$('.bar .speed').style.width = percent;
        this.$('.star_time').innerText = this.formateTime(this.audio.currentTime);
    }


    formateTime(secondsTotal) {
        let minutes = parseInt(secondsTotal / 60);
        minutes = minutes >= 10 ? '' + minutes : '0' + minutes;
        let seconds = parseInt(secondsTotal % 60);
        seconds = seconds >= 10 ? '' + seconds : '0' + seconds;
        return minutes + ':' + seconds
    }

    /**/
    /*
    *    start_play() {
    *    this.audio.oncanplaythrough = () => this.audio.play()
    *    }
    *   直接使用that.audio.play()会报错，具体原因待详细了解
    */
}


new player('#player');
//window.player = new player();
/*
* BUG&功能
* >点上一首下一首播放按钮状态显示不正确   :OK
* >播放界面的第二行歌词，歌曲播放完毕后没有最后一行了会报错    :OK
* >点击上一首下一首，应先清空之前歌词
* >点击上一首下一首，应先清空之前播放进度条
* >增加临时音乐列表
* */