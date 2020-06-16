import { AppConsts } from '@/abpZero/shared/AppConsts'
import { SubdomainTenancyNameFinder } from '@/abpZero/shared/helpers/SubdomainTenancyNameFinder'
import * as moment from 'moment'
import * as _ from 'lodash'
import { XmlHttpRequestHelper } from '@/abpZero/shared/helpers/XmlHttpRequestHelper'
export class AppPreBootstrap {
  static run (appconfig, callback, resolve, reject) {
    AppPreBootstrap.getApplicationConfig(appconfig, () => {
      AppPreBootstrap.getUserConfiguration(callback)
    })
  }

  static getApplicationConfig (appconfig, callback) {
    let result = appconfig
    const subdomainTenancyNameFinder = new SubdomainTenancyNameFinder()
    const tenancyName = subdomainTenancyNameFinder.getCurrentTenancyNameOrNull(result.appBaseUrl)

    AppConsts.appBaseUrlFormat = result.appBaseUrl
    AppConsts.remoteServiceBaseUrlFormat = result.remoteServiceBaseUrl
    AppConsts.remoteSignalrBaseUrl = result.remoteSignalrBaseUrl
    AppConsts.localeMappings = result.localeMappings

    if (tenancyName == null) {
      AppConsts.appBaseUrl = result.appBaseUrl.replace(AppConsts.tenancyNamePlaceHolderInUrl + '.', '')
      AppConsts.remoteServiceBaseUrl = result.remoteServiceBaseUrl.replace(AppConsts.tenancyNamePlaceHolderInUrl + '.', '')
    } else {
      AppConsts.appBaseUrl = result.appBaseUrl.replace(AppConsts.tenancyNamePlaceHolderInUrl, tenancyName)
      AppConsts.remoteServiceBaseUrl = result.remoteServiceBaseUrl.replace(AppConsts.tenancyNamePlaceHolderInUrl, tenancyName)
    }
    callback()
  }
  static getUserConfiguration (callback) {
    const cookieLangValue = abp.utils.getCookieValue('Abp.Localization.CultureName')
    const token = abp.auth.getToken()
    let requestHeaders = {
      '.AspNetCore.Culture': ('c=' + cookieLangValue + '|uic=' + cookieLangValue),
      'Abp.TenantId': abp.multiTenancy.getTenantIdCookie()
    }
    if (token) {
      requestHeaders['Authorization'] = 'Bearer ' + token
    }
    return XmlHttpRequestHelper.ajax('GET', AppConsts.remoteServiceBaseUrl + '/AbpUserConfiguration/GetAll', requestHeaders, null, (response) => {
      let result = response.result
      _.merge(abp, result)
      abp.clock.provider = this.getCurrentClockProvider(result.clock.provider)
      moment.locale(abp.localization.currentLanguage.name)
      // window.moment.locale(abp.localization.currentLanguage.name);
      if (abp.clock.provider.supportsMultipleTimezone) {
        moment.tz.setDefault(abp.timing.timeZoneInfo.iana.timeZoneId)
        // window.moment.tz.setDefault(abp.timing.timeZoneInfo.iana.timeZoneId);
      }
      abp.event.trigger('abp.dynamicScriptsInitialized')
      AppConsts.recaptchaSiteKey = abp.setting.get('Recaptcha.SiteKey')
      AppConsts.subscriptionExpireNootifyDayCount = parseInt(abp.setting.get('App.TenantManagement.SubscriptionExpireNotifyDayCount'))
      abp.localization.defaultSourceName = AppConsts.localization.defaultLocalizationSourceName
      callback()
      // DynamicResourcesHelper.loadResources(callback);
    })
  }
  static getCurrentClockProvider (currentProviderName) {
    if (currentProviderName === 'unspecifiedClockProvider') {
      return abp.timing.unspecifiedClockProvider
    }
    if (currentProviderName === 'utcClockProvider') {
      return abp.timing.utcClockProvider
    }
    return abp.timing.localClockProvider
  }
}
