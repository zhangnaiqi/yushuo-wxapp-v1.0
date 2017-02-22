import wx from 'labrador-immutable';

var util = require('../utils/util.js');
var api = require('./api.js');

var app = getApp();

//  网络请求方法
//   url ： 请求url
//   data ： 参数
//   successCallback ： 成功回调函数
//   errorCallback： 失败回调函数
//   completeCallback ： 完成回调函数
async function requestData(url, data) {
    if (app.debug) {
        console.log('requestData url: ', url);
    }
    const result = await wx.request({
        url: url,
        data: data,
        header: { 'Content-Type': 'application/json' }
    });
    return result;
}
//获取故事详情
function getStory(newsId) {
    return requestData(api.getStory(newsId));
}
//获取故事评论
function getComments(commentId) {
    return requestData(api.getComments(commentId));
}
//获取景点信息
const getScenic = (id) => {
        return requestData(api.getScenic(id));
    }
    //获取景点下的故事列表
const getIndexScenice = (id, page) => {
        return requestData(api.getIndexScenice(id, page));
    }
    //获取景区信息
const getJingqu = (id) => {
        return requestData(api.getJingqu(id));
    }
    //获取景区下的故事列表
const getSceniceStory = (id, page) => {
        return requestData(api.getSceniceStory(id, page), {});
    }
    // 获取搜索热门
const hotsearch = () => {
        return requestData('https://capi.fishsaying.com/capi/search/hotsearch', {});
    }
    // 搜索
const search = (name) => {
    return requestData(api.search(name), {});
}
module.exports = {
    getStory: getStory,
    getComments: getComments,
    getIndexScenice,
    getScenic: getScenic,
    getJingqu: getJingqu,
    getSceniceStory: getSceniceStory,
    hotsearch: hotsearch,
    search: search
};