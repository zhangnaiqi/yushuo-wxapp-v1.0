import wx, { Component, PropTypes } from 'labrador-immutable';

const requests = require('../../request/request.js');

class ScenicSpots extends Component {
    state = {
        id: "",
        page: 1,
        scenic: {},
        SceniceStory: {},
        height: 0,
        width: 0,
        loadingMore: false
    };

    async onLoad(options) {
        console.log(options)
        const res = await wx.getSystemInfo();
        this.setState({
            height: res.windowHeight,
            width: res.windowWidth
        });
        const id = options.id;
        this.setState({ id: id });
    };
    onShareAppMessage() {
        return {
            title: this.state.scenic.title,
            desc: '为你收集了关于这里的所有故事，点这儿收听'
        }
    };
    async onReady() {
        this.request()
    };

    async request() {
        try {
            const promiseAll = Promise.all([
                requests.getJingqu(this.state.id === undefined ? '54cdcb029a0b8ad439d02680' : this.state.id),
                requests.getSceniceStory(this.state.id === undefined ? '54cdcb029a0b8ad439d02680' : this.state.id, this.state.page)
            ]);
            const [resp, resp2] = await promiseAll;
            const bar = resp.data.result.title
            console.log(bar)
            wx.setNavigationBarTitle({
                title: bar || ""
            })
            this.setState({
                scenic: resp.data.result,
                SceniceStory: resp2.data.result.items
            })
        } catch (e) {
            console.log('get error: ', e);
            wx.showToast({
                title: '请下拉刷新',
                icon: 'loading',
            });
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
    async loadMore() {
        console.log("load")
        this.setState({
            loadingMore: true
        })
        if (this.state.loadingMore) {
            return
        } else {
            try {
                const res = await requests.getSceniceStory(this.state.id, this.state.page + 1);
                let newSceniceStory = [];
                newSceniceStory = this.state.SceniceStory;
                console.log("load:", res.data.result.items, newSceniceStory)
                newSceniceStory = newSceniceStory.concat(res.data.result.items);
                this.setState({
                    SceniceStory: newSceniceStory,
                    page: this.state.page + 1,
                    loadingMore: false
                })
            } catch (e) {
                console.log('get error: ', e);
                wx.showToast({
                    title: '请下拉刷新',
                    icon: 'loading',
                });
            }

        }
    };
    async onPullDownRefresh() {
        await this.request();
        this.setState({
            loadingMore: false
        })
        wx.showToast({ title: '刷新成功' });
        wx.stopPullDownRefresh();
    }
}

export default ScenicSpots;