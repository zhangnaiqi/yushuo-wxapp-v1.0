const requests = require('../../request/request.js');

import wx, { Component, PropTypes } from 'labrador-immutable'
import _ from 'lodash';

class Search extends Component {
    constructor() {
        super();
        this.inputValue = _.debounce(this.inputValue, 200);
    }
    state = {
        id: "",
        page: 1,
        height: 0,
        width: 0,
        hotsearch: [],
        story: {},
        scenics: {},
        figures: {},
        cloudguides: {},
        searchTitle: '',
        nearbyStory: {},
        loadingMore: false,
    };

    async onLoad(e) {

        try {
            const res = await wx.getSystemInfo();
            this.setState({
                height: res.windowHeight,
                width: res.windowWidth
            });
        } catch (err) {
            console.log('getSystemInfo ', err);
        }
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
        const promiseAll = Promise.all([
            requests.hotsearch(),
            this.nearby()
        ]);
        try {
            const [res, nea] = await promiseAll;
            console.log("res:", res, "nea:", nea)
            this.setState({
                hotsearch: res.data.result.items,
                nearbyStory: nea.voices
            })
        } catch (e) {
            console.log('request ', err);
            wx.showToast({
                title: '请下拉刷新',
                icon: 'loading',
            });
        }
    }

    async nearby(page = 1) {
        if (!wx.app.position) {
            try {
                const position = await wx.getLocation();
                wx.app.position = position;
            } catch (err) {
                console.log('get position: ', err);
                wx.app.position = { latitude: 30.572269, longitude: 104.066541 }
            }
        }
        const voicesUrl = `https://capi.fishsaying.com/capi/article/voices?latitude=${wx.app.position.latitude}&longitude=${wx.app.position.longitude}&radius=1000&limit=15&page=${page}`
        try {
            const resp = await wx.request({
                url: voicesUrl
            });
            if (typeof(resp.data) === 'object' && resp.data.result) {
                const voices = resp.data.result.items;
                for (let voice of voices) {
                    voice.distance = Number(voice.distance).toFixed(0); //getDistance({ lat: wx.app.position.latitude, long: wx.app.position.longitude }, { lat: voice.location.lat, long: voice.location.lng });
                }
                return { voices };
            } else {
                return { errMsg: '网络请求错误' };
            }
        } catch (e) {
            console.log('get error: ', e)
            return { errMsg: '网络请求错误' };
            wx.showToast({
                title: '请下拉刷新',
                icon: 'loading',
            });
        }
    }

    inputValue(e) {
        console.log(e.detail.value)
        this.setState({
            searchTitle: e.detail.value
        })
        const searchName = encodeURI(e.detail.value);
        console.log("searchName", searchName)
        if (searchName !== '') {
            this.search(searchName);
        }
    }

    async search(data) {
        console.log("data", data)
        try {
            const res = await requests.search(data);
            console.log("res", res)
            this.setState({
                story: res.data.result.articles,
                scenics: res.data.result.scenics,
                figures: res.data.result.figures,
                cloudguides: res.data.result.cloudguides
            })
        } catch (e) {
            console.log('search ', err);
            wx.showToast({
                title: '请下拉刷新',
                icon: 'loading',
            });
        }
    }
    hotSearch(e) {
        this.setState({
            searchTitle: e.currentTarget.dataset.searchname
        })
        const searchName = encodeURI(e.currentTarget.dataset.searchname);
        console.log("encodeURI", searchName)
        this.search(searchName);
    }
    async loadMore() {
        this.setState({
            loadingMore: true
        })
        if (this.state.loadingMore) {
            return
        } else {
            const result = await this.nearby(this.state.page + 1);
            if (result.voices) {
                this.setState({ nearbyStory: this.state.nearbyStory.concat(result.voices), page: this.state.page + 1, loadingMore: false });
            } else if (result.errMsg) {
                this.setState({ errMsg: result.errMsg });
            }
        }

    };
    toSceniceSpots(e) {
        console.log(e)
        const id = e.currentTarget.dataset.id;
        wx.navigateTo({
            url: '../scenicSpots/scenicSpots?id=' + id
        });
    };
    toStory(e) {
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
export default Search;