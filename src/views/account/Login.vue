<template>
  <div class="main">
    <a-form
      id="formLogin"
      class="user-layout-login"
      ref="formLogin"
      :form="form"
      @submit="handleSubmit"
    >
          <a-form-item>
            <a-input
              size="large"
              type="text"
              placeholder="请输入登录账号"
              v-decorator="[
                'username',
                {rules: [{ required: true, message: '请输入帐户名或邮箱地址' }, { validator: handleUsernameOrEmail }], validateTrigger: 'change'}
              ]"
            >
              <a-icon slot="prefix" type="user" :style="{ color: 'rgba(0,0,0,.25)' }"/>
            </a-input>
          </a-form-item>

          <a-form-item>
            <a-input
              size="large"
              type="password"
              autocomplete="false"
              placeholder="请输入登录密码"
              v-decorator="[
                'password',
                {rules: [{ required: true, message: '请输入密码' }], validateTrigger: 'blur'}
              ]"
            >
              <a-icon slot="prefix" type="lock" :style="{ color: 'rgba(0,0,0,.25)' }"/>
            </a-input>
          </a-form-item>

      <a-form-item>
        <a-checkbox v-decorator="['rememberMe']">自动登录</a-checkbox>
      </a-form-item>

      <a-form-item style="margin-top:24px">
        <a-button
          size="large"
          type="primary"
          htmlType="submit"
          class="login-button"
          :loading="state.loginBtn"
          :disabled="state.loginBtn"
        >确定</a-button>
      </a-form-item>
    </a-form>

    <two-step-captcha
      v-if="requiredTwoStepCaptcha"
      :visible="stepCaptchaVisible"
      @success="stepCaptchaSuccess"
      @cancel="stepCaptchaCancel"
    ></two-step-captcha>
  </div>
</template>

<script>
import md5 from 'md5'
import TwoStepCaptcha from '@/components/tools/TwoStepCaptcha'
import { mapActions } from 'vuex'
import { timeFix } from '@/utils/util'
import { getSmsCaptcha, get2step } from '@/api/login'


import { TokenService } from '@/abpZero/abp-vue-module/auth/token.service'
import { UtilsService } from '@/abpZero/abp-vue-module/utils/utils.service'
import { AppConsts } from '@/abpZero/shared/AppConsts'
import { TokenAuthServiceProxy } from '@/abpZero/shared/service-proxies/TokenAuthServiceProxy'
import { LocalStorageService } from '@/abpZero/shared/common/localStorage.Service'

let _tokenAuthServiceProxy = new TokenAuthServiceProxy()
let _tokenService = new TokenService()
let _localStorageService = new LocalStorageService()
let _utilsService = new UtilsService()

export default {
  components: {
    TwoStepCaptcha
  },
  data () {
    return {
      customActiveKey: 'tab1',
      loginBtn: false,
      // login type: 0 email, 1 username, 2 telephone
      loginType: 0,
      requiredTwoStepCaptcha: false,
      stepCaptchaVisible: false,
      form: this.$form.createForm(this),
      state: {
        time: 60,
        loginBtn: false,
        // login type: 0 email, 1 username, 2 telephone
        loginType: 0,
        smsSendBtn: false
      }
    }
  },
  created () {
    // get2step({ })
    //   .then(res => {
    //     this.requiredTwoStepCaptcha = res.result.stepCode
    //   })
    //   .catch(() => {
    //     this.requiredTwoStepCaptcha = false
    //   })
    // this.requiredTwoStepCaptcha = true
  },
  methods: {
    ...mapActions(['Login', 'Logout']),
    // handler
    handleUsernameOrEmail (rule, value, callback) {
      const { state } = this
      const regex = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/
      if (regex.test(value)) {
        state.loginType = 0
      } else {
        state.loginType = 1
      }
      callback()
    },
    handleTabClick (key) {
      this.customActiveKey = key
      // this.form.resetFields()
    },
    handleSubmit (e) {
      e.preventDefault()
      const {
        form: { validateFields },
        state,
        customActiveKey,
        Login
      } = this

      state.loginBtn = true

      const validateFieldsKey = customActiveKey === 'tab1' ? ['username', 'password'] : ['mobile', 'captcha']

      validateFields(validateFieldsKey, { force: true }, (err, values) => {
        let rememberMe=true;
        if (!err) {
            _tokenAuthServiceProxy.authenticate(
              {
                usernameOrEmailAddress: values.username,
                password: values.password
              }
            )
              .then(authenticateResult => {
                //abp.ui.clearBusy()
                // let tokenExpireDate = this.rememberMe ? (new Date(new Date().getTime() + 1000 * result.expireInSeconds)) : undefined
                // _tokenService.setToken(result.accessToken, tokenExpireDate)
                // _utilsService.setCookieValue(AppConsts.authorization.encrptedAuthTokenName, result.encryptedAccessToken, tokenExpireDate, abp.appPath)// PC端signalr使用              
                //location.href = '/' // 登陆成功后，整个web程序重新加载
                this.login(authenticateResult.accessToken, authenticateResult.encryptedAccessToken, authenticateResult.expireInSeconds, 
                authenticateResult.refreshToken, authenticateResult.refreshTokenExpireInSeconds, rememberMe,
                 authenticateResult.twoFactorRememberClientToken, '/');                  
              })
              .catch(error => {
                state.loginBtn = false
                //abp.ui.clearBusy()
                console.error(error)
              })

        } else {
          setTimeout(() => {
            state.loginBtn = false
          }, 600)
        }
      })
    },
    login(accessToken, encryptedAccessToken, expireInSeconds, refreshToken, refreshTokenExpireInSeconds, rememberMe, twoFactorRememberClientToken, redirectUrl) {
        let tokenExpireDate = rememberMe ? (new Date(new Date().getTime() + 1000 * expireInSeconds)) : undefined;
        _tokenService.setToken(accessToken, tokenExpireDate);
        if (refreshToken && rememberMe) {
            let refreshTokenExpireDate = rememberMe ? (new Date(new Date().getTime() + 1000 * refreshTokenExpireInSeconds)) : undefined;
            _tokenService.setRefreshToken(refreshToken, refreshTokenExpireDate);
        }
        _localStorageService.setItem(AppConsts.authorization.encrptedAuthTokenName, {
            token: encryptedAccessToken,
            expireDate: tokenExpireDate
        });
        if (twoFactorRememberClientToken) {
            _localStorageService.setItem(LoginService_1.twoFactorRememberClientTokenName, {
                token: twoFactorRememberClientToken,
                expireDate: new Date(new Date().getTime() + 365 * 86400000),
            });
        }
        if (redirectUrl) {
            location.href = redirectUrl;
        }
        else {
            let initialUrl = UrlHelper.initialUrl;
            if (initialUrl.indexOf('/account') > 0) {
                initialUrl = AppConsts.appBaseUrl;
            }
            location.href = initialUrl;
        }
    },
    getCaptcha (e) {
      e.preventDefault()
      const { form: { validateFields }, state } = this

      validateFields(['mobile'], { force: true }, (err, values) => {
        if (!err) {
          state.smsSendBtn = true

          const interval = window.setInterval(() => {
            if (state.time-- <= 0) {
              state.time = 60
              state.smsSendBtn = false
              window.clearInterval(interval)
            }
          }, 1000)

          const hide = this.$message.loading('验证码发送中..', 0)
          getSmsCaptcha({ mobile: values.mobile }).then(res => {
            setTimeout(hide, 2500)
            this.$notification['success']({
              message: '提示',
              description: '验证码获取成功，您的验证码为：' + res.result.captcha,
              duration: 8
            })
          }).catch(err => {
            setTimeout(hide, 1)
            clearInterval(interval)
            state.time = 60
            state.smsSendBtn = false
            this.requestFailed(err)
          })
        }
      })
    },
    stepCaptchaSuccess () {
      this.loginSuccess()
    },
    stepCaptchaCancel () {
      this.Logout().then(() => {
        this.loginBtn = false
        this.stepCaptchaVisible = false
      })
    },
    loginSuccess (res) {
      console.log(res)
      this.$router.push({ name: 'dashboard' })
      // 延迟 1 秒显示欢迎信息
      setTimeout(() => {
        this.$notification.success({
          message: '欢迎',
          description: `${timeFix()}，欢迎回来`
        })
      }, 1000)
    },
    requestFailed (err) {
      this.$notification['error']({
        message: '错误',
        description: ((err.response || {}).data || {}).message || '请求出现错误，请稍后再试',
        duration: 4
      })
    }
  }
}
</script>

<style lang="less" scoped>
.user-layout-login {
  label {
    font-size: 14px;
  }

  .getCaptcha {
    display: block;
    width: 100%;
    height: 40px;
  }

  .forge-password {
    font-size: 14px;
  }

  button.login-button {
    padding: 0 15px;
    font-size: 16px;
    height: 40px;
    width: 100%;
  }

  .user-login-other {
    text-align: left;
    margin-top: 24px;
    line-height: 22px;

    .item-icon {
      font-size: 24px;
      color: rgba(0, 0, 0, 0.2);
      margin-left: 16px;
      vertical-align: middle;
      cursor: pointer;
      transition: color 0.3s;

      &:hover {
        color: #1890ff;
      }
    }

    .register {
      float: right;
    }
  }
}
</style>
