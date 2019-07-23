import axios from 'axios'
//import config from '../config/index'
import appconfig from '@/abpZero/appconfig'
import Qs from 'qs'
import * as moment from 'moment';
//第一个参数为需要序列化的数据
//第二个参数为配置选项

 

import { AbpHttpConfiguration,AbpHttpInterceptor } from '@/abpZero/abp-vue-module/abpHttpInterceptor'
let _abpHttpConfiguration=new AbpHttpConfiguration();
let _abpHttpInterceptor=new AbpHttpInterceptor(_abpHttpConfiguration);
const HttpClient = axios.create({
    baseURL: appconfig.remoteServiceBaseUrl, // api 的 base_url
    timeout: 5000, // request timeout
    paramsSerializer: function(params) {
      return Qs.stringify(params, {
            serializeDate: (date) => {
                //用moment处理日期比较方便，自己写格式化方法也可以
                return moment(date).format('YYYY-MM-DD HH:mm:ss')
            }
        })
    },    
  })


//请求拦截 request interceptor(设置token，jwt格式)
HttpClient.interceptors.request.use(
    config => {
      
      // let token=tokenAuth.getToken();      
      // if(token!=null){
      // let token=abp.auth.getToken();
      // if (token) {   //登陆情况下        
      //   config.headers['Authorization'] ='Bearer ' + token  //也可以通过配置自定义格式
      // }
      //addAuthorizationHeaders(config.headers);
      //addTenantIdHeader(config.headers);
      _abpHttpInterceptor.normalizeRequestHeaders(config.headers);
      return config;
    
    },
    error => {
      // Do something with request error
      console.error(error) // for debug
      Promise.reject(error)
    }
)

  
  // response interceptor
HttpClient.interceptors.response.use(
    /**
     * 下面的注释为通过在response里，自定义code来标示请求状态
     * 当code返回如下情况则说明权限有问题，登出并返回到登录页
     * 如想通过 xmlhttprequest 来状态码标识 逻辑可写在下面error中
     * 以下代码均为样例，请结合自生需求加以修改，若不需要，则可删除
     */
    response => {
      if(response.data.mock){  //mock 数据，约定格式为{mock:data}
        return response.data.mock
      }      
      let result=_abpHttpConfiguration.handleResponse(response);
      return result;
      //401 未授权登出   //500 内部错误 转到错误页   //200  判断业务code 进行相应处理，比如处理多端登陆等
      //return response.data
    },
    error => {
      console.log(error); // for debug
      let result=_abpHttpConfiguration.handleResponse(error.response);
      return Promise.reject(error)
    }
)








export default HttpClient