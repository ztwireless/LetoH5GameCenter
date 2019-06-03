/**
 * Created by pengguanfa on 2017/10/25.
 * 扩展api配置
 */
window.LetoConf = {
  extApi:[
    {
      name: 'testApi',
      fn: function (params) {
        this.showToast(params)
      },
      params: {
        title: ''
      }
    },
    {
      name: 'openPage',
      params: {
        name: '',
        param: {}
      }
    },
    {
      name: 'getCookie',
      params: {
        host: ''
      }
    },
    {
      name: 'openLink',
      params: {
        url: ''
      }
    }
  ]
}
window.LetoConf && window.LetoConf.extApi && (window.LetoExtApiConf = window.LetoConf.extApi)
