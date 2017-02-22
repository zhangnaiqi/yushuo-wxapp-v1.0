const CAPI = 'https://capi.fishsaying.com';
const story = CAPI + '/capi/article/v2/article?article_id=';
const comments = CAPI + '/capi/v2/comments/'
    //  获取单条故事
const getStory = (Id) => {
        return story + Id;
    }
    //获取评论
const getComments = (commentId) => {
        return comments + commentId + '/comments?limit=20&page=1';
    }
    // 获取景点信息
const getScenic = (id) => {
        return CAPI + '/capi/scenic/v2/' + id + '?trim_empty_voices=1&scenic_id=' + id;
    }
    // 获取首页景点列表
const getIndexScenice = (id, page) => {
        return CAPI + '/capi/scenic/' + id + '/scenicSpots?&page=' + page + '&limit=15';
    }
    // 获取景区信息
const getJingqu = (id) => {
        return CAPI + '/capi/scenic/v2/' + id + '?trim_empty_voices=1';
    }
    // 获取景区景点列表列表
const getSceniceStory = (id, page) => {
        return CAPI + '/capi/article/v2/scenics/voices?&scenics_id=' + id + '&page=' + page + '&limit=20';
    }
    //搜索
const search = (name) => {
    return CAPI + '/capi/search/global?keyword=' + name + '&page=1&limit=20';
}
module.exports = {
    getStory: getStory,
    getComments: getComments,
    getScenic: getScenic,
    getJingqu: getJingqu,
    getSceniceStory: getSceniceStory,
    search: search,
    getIndexScenice,
};