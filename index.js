var app = getApp()

Page({
  data: {
    access_token: null
  },

  onLoad: function (options) {
    wx.clearStorageSync()
  },

  loginTap: function(event) {
    wx.login({
      success: function(res) {
        var code = res.code
        wx.request({
          url: 'https://api.weixin.qq.com/sns/jscode2session?appid=' + app.globalData.appId + '&secret=' + app.globalData.secret + '&js_code=' + code + '&grant_type=authorization_code',
          success: function(res) {
            wx.setStorageSync('openid', res.data.openid)
            console.log(res.data.openid)
            wx.showToast({
              title: 'success',
              icon: 'success',
              duration: 2000
            })
          }
        })
      }
    })
  },

  // 发送模板消息
  formSubmit: function(event) {
    wx.showToast({
      title: 'loading',
      icon: 'loading',
      duration: 2000
    })
    var touser = null
    wx.getStorage({
      key: 'openid',
      success: function(res) {
        touser = res.data
      }
    })
    this.getAccessToken()
    var formId = event.detail.formId
    var template_id = 'HtP_ORRdqPQnL_w3qwuGwmNzTW29_jK-nU4GrYeeHys'
    var that = this
    wx.request({
      url: 'https://api.weixin.qq.com/cgi-bin/message/wxopen/template/send?access_token=' + that.data.access_token,
      data: {
        touser: touser,
        template_id: template_id,
        form_id: formId,
      },
      method: 'POST',
      success: function (res) {
        console.log(touser)
        console.log("发送成功");
        console.log(res);
      },
      fail: function (err) {
        console.log("push err")
        console.log(err);
      }
    })
  },

  // 获得access_token
  getAccessToken: function() {
    var that = this
    wx.request({
      url: "https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=" + app.globalData.appId + "&secret=" + app.globalData.secret,
      success: function(res) {
        that.setData({
          access_token: res.data.access_token
        })
      }
    })
  }
})