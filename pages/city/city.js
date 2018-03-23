const cities = require('./data');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        // 页面状态
        // 0 加载中
        // 1 为得到正确的结果
        // -1 获取城市数据出错
        pageStatus: 0,
        // 字母索引
        letters: null,
        // 选中的字母
        showLetter: "",
        // 是否显示选中的字母
        isShowLetter: false,
        // 窗口高度
        winHeight: 0,
        scrollTop: 0,//置顶高度
        scrollTopId: '',//置顶id
        historyCities: null,
        hotCities: null,
        cities: null
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

        // 之前在处理好格式的数据缓存
        if (!cities || !cities.cities) {
            this.setData({
                pageStatus: -1
            })
            return;
        }
        let historyCities = null;
        const localCities = wx.getStorageSync("CITIES_HISTORY") || null;
        if (localCities && localCities.cities) {
            historyCities = localCities.cities;
        }
        this.setData({
            letters: cities.letters,
            hotCities: cities.hotCities,
            cities: cities.cities,
            historyCities
        });

    },

    onReady: function () {
        const winHeight = wx.getSystemInfoSync().windowHeight;
        this.setData({
            pageStatus: 1,
            winHeight
        });
    },

    /**
     * 字母索引点击事件:
     * 提示当前点击的字母,1000ms
     * 滚动到当前字母开头的城市列表位置
     */
    clickLetter: function (e) {
        const self = this;
        const showLetter = e.currentTarget.dataset.letter;
        self.setData({
            showLetter: showLetter,
            isShowLetter: true,
            scrollTopId: showLetter,
        })

        setTimeout(function () {
            self.setData({
                isShowLetter: false
            })
        }, 1000)
    },

    //选择城市
    bindCity: function (e) {
        // 处理缓存
        let history = wx.getStorageSync("CITIES_HISTORY") || {};
        const { label, value } = e.currentTarget.dataset;
        if (history && history.values && history.values.includes(value)) {
            // 缓存中已经存在了，不更新历史记录
        } else {
            let cities = history.cities || [],
                values = history.values || [];

            // 在最前面插入一条
            cities.unshift({ label, value });
            values.unshift(value);

            // 最多缓存8个
            if (cities.length >= 8) {
                cities = cities.slice(0, 8);
                values = values.slice(0, 8);
            }
            const historyCities = { cities, values };
            wx.setStorageSync("CITIES_HISTORY", historyCities);
        }
        wx.setStorageSync("QUOTE_CITY", { label, value });
    },
    //点击热门城市回到顶部
    hotCity: function () {
        this.setData({
            scrollTop: 0,
        })
    }
})