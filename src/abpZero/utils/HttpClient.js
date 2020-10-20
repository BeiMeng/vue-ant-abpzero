import axios from 'axios'
//import config from '../config/index'
import appconfig from '@/abpZero/appconfig'
import Qs from 'qs'
import * as moment from 'moment';
import { AppConsts } from '@/abpZero/shared/AppConsts'
//第一个参数为需要序列化的数据
//第二个参数为配置选项
import { TokenService } from '@/abpZero/abp-vue-module/auth/token.service'
import { TokenAuthServiceProxy } from '@/abpZero/shared/service-proxies/TokenAuthServiceProxy'
import { LocalStorageService } from '@/abpZero/shared/common/localStorage.Service'

let _tokenAuthServiceProxy = new TokenAuthServiceProxy()
let _tokenService = new TokenService()
let _localStorageService = new LocalStorageService()

import { AbpHttpConfiguration,AbpHttpInterceptor } from '@/abpZero/abp-vue-module/abpHttpInterceptor'
let _abpHttpConfiguration=new AbpHttpConfiguration();
let _abpHttpInterceptor=new AbpHttpInterceptor(_abpHttpConfiguration);

// import axiosRetry from 'axios-retry';

// axiosRetry(axios, { retries: 3 });

const HttpClient = axios.create({
    baseURL: appconfig.remoteServiceBaseUrl, // api 的 base_url
    timeout: 30000, // request timeout //有的接口请求时间过长，超过此时间，显示为canceld
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
      //401 未授权登出   //500 内部错误 转到错误页   //200  判断业务code 进行相应处理，比如处理多端登陆等
      //return response.data         
      let result=_abpHttpConfiguration.handleResponse(response);
      return result;

    },
    error => {
      let result=_abpHttpConfiguration.handleResponse(error.response);
      return Promise.reject(error);

      // if (error.response) {    //todo 请求后401,进行刷新token.目前无法实现重新返回原请求问题
      //   switch (error.response.status) {
      //     case 401:
      //       //abp后端刷新的验证失效全部改成AbpAuthorizationException 错误 
      //       if(error.config.url.indexOf('/TokenAuth/RefreshToken')>=0){  
      //         location.reload();
      //       }
      //       //登陆接口401进行正常异常处理流程
      //       if(error.config.url.indexOf('/TokenAuth/Authenticate')>=0){  
      //         _abpHttpConfiguration.handleResponse(error.response);
      //         return Promise.reject(error)              
      //       }

      //       //其他接口，进行无感知刷新token流程
      //       let refreshToken =_tokenService.getRefreshToken();
      //       debugger
      //       if (!refreshToken || refreshToken.trim() === '') {
      //         location.reload();
      //       }
      //       _tokenAuthServiceProxy.refreshToken(refreshToken)
      //       .then(tokenResult=>{
      //         if (tokenResult && tokenResult.accessToken) {
      //           let tokenExpireDate = (new Date(new Date().getTime() + 1000 * tokenResult.expireInSeconds));
      //           _tokenService.setToken(tokenResult.accessToken, tokenExpireDate);
    
      //           _localStorageService.setItem(AppConsts.authorization.encrptedAuthTokenName,
      //             {
      //                 token: tokenResult.encryptedAccessToken,
      //                 expireDate: tokenExpireDate
      //             });
      //             //就是重新调用接口获取数据
      //             // var backoff = new Promise(resolve => {
      //             //   resolve();
      //             // });
      //             // return backoff.then(r => {
      //             //   return HttpClient(error.config);
      //             // });
      //             return new Promise(resolve => resolve(HttpClient(error.config)));
      //         }else{
      //           location.reload();
      //         }             
      //       })
      //       .catch(error=>{
      //         location.reload();
      //       })
      //       break;     
      //     default:
      //       let result=_abpHttpConfiguration.handleResponse(error.response);
      //       return Promise.reject(error)
      //   }
      // }else{
      //   let result=_abpHttpConfiguration.handleResponse(error.response);
      //   return Promise.reject(error);  
      // }           
    }
)








export default HttpClient