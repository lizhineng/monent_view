// index.js
// 获取应用实例
const app = getApp()

Page({
  data: {
    motto: 'fomeiherz',
    src:"../../image/photo.jpg",
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  // 事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  // 跳转至上传页面
  jumpToUpload: function() {
      wx.navigateTo({
          url: '../uploadImg/uploadImg'
      })
  },
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
    }
  },
  // 选择照片的组件
  chooseImageTap: function() {
      var _this = this;
      wx.chooseImage({
          count: 1, // 图片数量
          sizeType: ['compressed'],
          sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
          success: function(res) {
              console.log(res);
              // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
              var tempFilePaths = res.tempFilePaths;
              var imagePath = tempFilePaths[0];
              // 预览照片
              _this.setData({
                  src: imagePath
              });
              console.log(_this);
              upload(_this, imagePath);
          },
      });
  },
  getUserInfo: function(e) {
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
})

function upload(page, path) {
    wx.showToast({
        icon: 'loading',
        title: '正在上传...',
    }),
    wx.uploadFile({
        url: '/servlet',
        filePath: path[0],
        name: 'file',
        header: {
            "Content-Type": "multipart/form-data"
        },
        formData: {
            //和服务器约定的token, 一般也可以放在header中
            'session_token': wx.getStorageSync('session_token')
        },
        success: function (res) {
            console.log(res);
            if (res.statusCode != 200) {
                wx.showModal({
                    title: '提示',
                    content: '上传失败',
                    showCancel: false
                })
                return;
            }
            var data = res.data
            page.setData({  //上传成功修改显示头像
                src: path[0]
            })
        },
        fail: function (e) {
            console.log(e);
            wx.showModal({
                title: '提示',
                content: '上传失败',
                showCancel: false
            })
        },
        complete: function () {
            wx.hideToast();  //隐藏Toast
        }
    })
}
