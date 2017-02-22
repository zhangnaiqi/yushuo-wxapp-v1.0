const requests = require('../../request/request.js');

import wx, { Component, PropTypes } from 'labrador-immutable';

class NewIndex extends Component {
    state = {
        id: '',
        page: 1,
        sceniclist: [],
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
            title: '鱼说故事，处处风景',
            desc: '星球的每一处角落都蕴藏着不为人知的秘密与故事，点这里收听',
            path: '/pages/newindex/newindex',
        }
    };
    onReady() {
        this.request();
    };
    async request() {
        const indexUrl = "https://api.fishsaying.com/indexScenicSpots.json"
        try {
            const resp = await wx.request({
                url: indexUrl
            });
            console.log("resp", resp)
            this.setState({
                sceniclist: resp.data
            });
        } catch (e) {
            console.log('get error: ', e);
            wx.showToast({
                title: '请下拉刷新',
                icon: 'loading',
            });
        }
    }

    toSearch() {
        console.log('toSearch....')
        wx.navigateTo({
            url: '../search/search'
        });
    };
    toSceniceSpots(e) {
        console.log(e)
        var id = e.currentTarget.dataset.id;
        wx.navigateTo({
            url: '../scenicSpots/scenicSpots?id=' + id
        });
    };
    async onPullDownRefresh() {
        this.request();
        wx.showToast({
            title: '刷新成功',
        });
        wx.stopPullDownRefresh();
    }
}

export default NewIndex;