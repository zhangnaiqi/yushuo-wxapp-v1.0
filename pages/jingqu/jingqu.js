const requests = require('../../request/request.js');

import wx, { Component, PropTypes } from 'labrador-immutable';

class JingQu extends Component {
    state = {
        id: '',
        page: 1,
        jingqu: {},
        scenic: {},
        sceniclist: {},
        height: 0,
        width: 0,
    };

    async onLoad(options) {
        const res = await wx.getSystemInfo();
        console.log('systemInfo: ', res)
        const id = options.id;
        this.setState({
            height: res.windowHeight,
            width: res.windowWidth,
            id: id
        });
    };
    onShareAppMessage() {
        return {
            title: '分享标题',
            desc: '鱼说是一个nb的公司。。。。',
            path: '/pages/scenicSpots/scenicSpots',
        }
    };
    onReady() {
        this.request();
    };

    async request() {
        const promiseAll = Promise.all([
            requests.getJingqu(this.state.id === undefined ? '54cdcb029a0b8ad439d02680' : this.state.id),
            requests.getJingquScenice(this.state.id === undefined ? '54cdcb029a0b8ad439d02680' : this.state.id, this.state.page)
        ]);
        const [resp, resp2] = await promiseAll;

        this.setState({
            jingqu: resp.data.result,
            scenic: resp2.data.result,
            sceniclist: resp2.data.result.items
        });
    }

    toScenicSpotsPage(e) {
        console.log(e)
        var id = e.currentTarget.dataset.id;
        wx.navigateTo({
            url: '../scenicSpots/scenicSpots?id=' + id
        });
    };
    toStoryPage(e) {
        console.log(e)
        var id = e.currentTarget.dataset.id;
        wx.navigateTo({
            url: '../story/story?id=' + id
        });
    };
    async onPullDownRefresh() {
        await this.request();
        wx.showToast({ title: '刷新成功' });
        wx.stopPullDownRefresh();
    }
}

export default JingQu;