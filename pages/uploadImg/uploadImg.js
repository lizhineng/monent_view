// uploadImg.js

const qiniuUploader = require("../../utils/qiniuUploader");
const util = require('../../utils/util.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    image1: '../../image/photo.jpg'
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },

  // 选择照片的组件
  chooseImageTap: function () {
    var _this = this;
    wx.chooseImage({
      count: 1, // 图片数量
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths;
        var imagePath = tempFilePaths[0];
        // 预览照片
        _this.setData({
          image1: imagePath
        });
        console.log(_this);
        upload(_this, imagePath);
      },
    });
  }
})

// 图片上传
function upload(that, filePath) {
  wx.showToast({
    icon: 'loading',
    title: '正在上传...',
  }),
  qiniuUploader.upload(filePath, (res) => {
    // that.setData({
    //   'image1': res.imageURL,
    // });
    // 取上传后的URL：res.imageURL
    console.log(res);
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
      uptoken: '',
  })
  // wx.uploadFile({
  //   url: '/servlet',
  //   filePath: path[0],
  //   name: 'file',
  //   header: {
  //     "Content-Type": "multipart/form-data"
  //   },
  //   formData: {
  //     //和服务器约定的token, 一般也可以放在header中
  //     'session_token': wx.getStorageSync('session_token')
  //   },
  //   success: function (res) {
  //     console.log(res);
  //     if (res.statusCode != 200) {
  //       wx.showModal({
  //         title: '提示',
  //         content: '上传失败',
  //         showCancel: false
  //       })
  //       return;
  //     }
  //     var data = res.data
  //     page.setData({  //上传成功修改显示头像
  //       src: path[0]
  //     })
  //   },
  //   fail: function (e) {
  //     console.log(e);
  //     wx.showModal({
  //       title: '提示',
  //       content: '上传失败',
  //       showCancel: false
  //     })
  //   },
  //   complete: function () {
  //     wx.hideToast();  //隐藏Toast
  //   }
  // })
}