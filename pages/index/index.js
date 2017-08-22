// index.js
// 获取应用实例
const app = getApp();
const qiniuUploader = require("../../utils/qiniuUploader");
const util = require('../../utils/util.js');

Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    image1: '',
    uploadedImage1: '',
    content:''
  },
  // 页面加载时，获取用户信息
  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    };
  },
  onShow: function() {
  },
  getUserInfo: function(e) {
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  // 选择照片的组件
  chooseImageTap: function () {
    var _this = this;
    wx.chooseImage({
      count: 1, // 图片数量
      sizeType: ['original'],
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths;
        var imagePath = tempFilePaths[0];
        // 预览照片
        _this.setData({
          image1: imagePath
        });
        upload(_this, imagePath);
      },
    });
  },
  // 输入框失去焦点时触发
  textareaBlurTap: function(e) {
    var _this = this;
    _this.setData({
      content: e.detail.value
    });
  },
  submitTap: function() {
    var _this = this;
    submit(_this);
  }
})

function submit(_this) {
  console.log(_this.data.uploadedImage1);
  wx.request({
    url: 'https://www.fomeiherz.top/moment',
    data : {
      image1: _this.data.uploadedImage1,
      content: _this.data.content
    },
    method: 'POST',
    header: {
      'content-type': 'application/x-www-form-urlencoded'
    },
    success: function (res) {
      if ("21020000" == res.data.retCode) {
        wx.showModal({
          title: 'success',
          content: '保存成功',
          success: function (res) {
            if (res.confirm) {
            } else if (res.cancel) {

            }
          }
        })
      }
    }
  })
}

// 图片上传
function upload(that, filePath) {
  wx.showToast({
    icon: 'loading',
    title: '正在上传...',
  }),
  qiniuUploader.upload(filePath, (res) => {
    that.setData({
      // 取上传后的URL：res.imageURL
      uploadedImage1: res.imageURL,
    });
  }, (error) => {
    console.log('error: ' + error);
  }, {
    region: 'SCN',
    key: "moment_" + util.formatTime(new Date()) + util.getSuffix(filePath),
    //uploadURL: 'https://up-z2.qbox.me',
    // 存储空间：moment
    domain: 'ouogw6o24.bkt.clouddn.com',
    // 存储空间：travel
    //domain: 'ouqar8cq5.bkt.clouddn.com',
    uptokenURL: 'https://www.fomeiherz.top/qiniu/uploadToken'
  })
}
