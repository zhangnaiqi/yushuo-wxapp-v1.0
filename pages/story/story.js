const requests = require('../../request/request.js');

import wx, { Component, PropTypes } from 'labrador-immutable'

class Story extends Component {
    state = {
        id: "",
        story: {},
        comments: {},
        slideHeight: 0,
        slideBottom: 0,
        slideWidth: 0,
        screenHeight: 0,
        screenWidth: 0,
        maskDisplay: 'none',
        slideAnimation: {},
        time: 1.5,
        play: true,
        playTime: ""
    };
    timer = null;

    async onLoad(e) {
        const res = await wx.getSystemInfo();
        console.log('systemInfo: ', res);
        this.setState({
            screenHeight: res.windowHeight,
            screenWidth: res.windowWidth,
            slideHeight: res.windowHeight * 0.9,
            slideBottom: res.windowHeight,
            slideWidth: res.windowWidth
        });
        var id = e.id;
        this.setState({ id: id });
    };
    onShareAppMessage() {
        return {
            title: this.state.story.title,
            desc: '你收到一条语音故事，点这里收听'
        }
    };
    onReady() {
        this.request();
    };
    setZero(num) {
        return num < 10 ? 0 + '' + num : num;
    }
    async request() {
        try {
            const promiseAll = Promise.all([
                requests.getStory(this.state.id)
            ]);
            const [resp] = await promiseAll;
            const bar = resp.data.result.title
            console.log(bar)
            wx.setNavigationBarTitle({
                title: bar || ""
            })
            const time = Math.floor(resp.data.result.length / 60) + '\'' + this.setZero(Math.floor(resp.data.result.length % 60)) + '\"';
            this.setState({
                story: resp.data.result,
                playTime: time
            });
            this.updatePlayState();
        } catch (e) {
            console.log('get error: ', e);
            wx.showToast({
                title: '请下拉刷新',
                icon: 'loading',
            });
        }
    }
    async audioPlay() {
        console.log('audioPlay...');
        if (wx.app.playId !== this.state.id) {
            wx.stopBackgroundAudio(); // 先停掉之前的语音
        }
        try {
            const r = await wx.playBackgroundAudio({
                dataUrl: this.state.story.trial_voice,
                title: this.state.story.title,
                coverImgUrl: this.state.story.cover.source,
            });
            console.log('play music', r);

            wx.app.playId = this.state.id;
            this.updatePlayState();
        } catch (e) {
            console.log('playBackgroundAudio error: ', e);
        }
    }
    updatePlayState() {
        if (this.timer) return;
        if (wx.app.playId !== this.state.id) {
            return; // 避免进入的故事页面， 看到老故事的播放进度
        }
        this.timer = setInterval(async() => {
            const res = await wx.getBackgroundAudioPlayerState();
            const Play = (res.status !== 1 ? true : false);
            let playTime = this.state.playTime;
            let time = this.state.time;
            if (res.currentPosition) {
                playTime = Math.floor(res.currentPosition / 60) + '\'' + this.setZero(Math.floor(res.currentPosition % 60)) + '\"'; // 播放状态（2：没有音乐在播放，1：播放中，0：暂停中）
                time = res.currentPosition / res.duration * 2 + 1.5;
            }
            this.setState({
                time,
                play: Play,
                playTime: playTime
            })
            const cxt_arc = wx.createCanvasContext('canvasArc'); //创建并返回绘图上下文context对象。  
            cxt_arc.setLineWidth(1);
            cxt_arc.setStrokeStyle('#32baa4');
            cxt_arc.setLineCap('butt')
            cxt_arc.beginPath(); //开始一个新的路径  
            cxt_arc.arc(45, 45, 44, 1.5 * Math.PI, Math.PI * this.state.time, false);
            cxt_arc.stroke(); //对当前路径进行描边  

            cxt_arc.draw();
        }, 17);
    };
    audioPause() {
        console.log("audioPause")
        this.page.setData({ // 确实是labrador的bug， 调用原生的setData就没有问题！
            'state.play': true
        });
        wx.pauseBackgroundAudio({
            success: () => {
                console.log('pauseBackgroundAudio success');
                // this.setState({ // 放在callback外面居然不行， 导致state没有刷新， 我感觉这可能是labrador的bug吧？！！ todo
                //     play: true
                // });
            },
            fail: () => {
                console.log('pauseBackgroundAudio fail');
            },
            complete: () => {
                console.log('pauseBackgroundAudio complete');
            }
        });
        console.log('set play...');
        clearInterval(this.timer);
        this.timer = null;
        console.log('audioPause ending...');
    };

    onUnload() {
        console.log('onUnload...')
        clearInterval(this.timer);
        this.timer = null;
    }
    async onPullDownRefresh() {
        await this.request();
        wx.showToast({ title: '刷新成功' });
        wx.stopPullDownRefresh();
    }
}
export default Story;