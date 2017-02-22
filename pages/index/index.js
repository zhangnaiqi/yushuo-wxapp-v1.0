import wx, { Component, PropTypes } from 'labrador-immutable';
import { getDistance } from 'geodistance';
import ScanCode from '../../components/scanCode/scanCode.js';

const requests = require('../../request/request.js');

class Index extends Component {
    state = {
        scenics: [],
        jingqus: [],
        voices: [],
        page: 1,
        height: 600,
        width: 0,
        loaded: false,
        loadingMore: false,
    };

    children() {
        return {
            scanCode: {
                component: ScanCode,
                props: {
                    width: 30,
                    height: 30,
                }
            }
        }
    }

    async onReady() {
        const result = await this.request();
        if (result.voices) {
            this.setState({ voices: result.voices, loaded: true });
        } else if (result.errMsg) {
            this.setState({ errMsg: result.errMsg, loaded: true });
        }
    };

    async request(page = 1) {
        console.log(wx.app.sysInfo)
        this.setState({
            height: wx.app.sysInfo.windowHeight
        })
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
        }
    }

    toStoryPage(e) {
        console.log(e)
        var id = e.currentTarget.dataset.id;
        wx.navigateTo({
            url: '../story/story?id=' + id
        });
    };
    tojingqu(e) {
        console.log(e)
        var id = e.currentTarget.dataset.id;
        wx.navigateBack({});
    };
    toSearch(e) {
        wx.navigateTo({
            url: '../search/search'
        });
    }
    async loadMore() {
        this.setState({
            loadingMore: true
        })
        if (this.state.loadingMore) {
            return
        } else {
            const result = await this.request(this.state.page + 1);
            if (result.voices) {
                this.setState({ voices: this.state.voices.concat(result.voices), loaded: true, page: this.state.page + 1, loadingMore: false });
            } else if (result.errMsg) {
                this.setState({ errMsg: result.errMsg, loaded: true });
            }
        }

    };
    async onPullDownRefresh() {
        const result = await this.request();
        if (result.voices) {
            this.setState({ voices: result.voices, loaded: true, loadingMore: false, errMsg: '' });
        } else if (result.errMsg) {
            this.setState({ errMsg: result.errMsg, loaded: true, loadingMore: false });
        }
        wx.showToast({ title: '刷新成功' });
        wx.stopPullDownRefresh();
    }
}

export default Index;