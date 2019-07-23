
import { AppConsts } from '@/abpZero/shared/AppConsts';
import { XmlHttpRequestHelper } from '@/abpZero/shared/helpers/XmlHttpRequestHelper';
let AppAuthService = class AppAuthService {
    logout(reload, returnUrl) {
        let customHeaders = {
            'Abp.TenantId': abp.multiTenancy.getTenantIdCookie(),
            'Authorization': 'Bearer ' + abp.auth.getToken()
        };
        XmlHttpRequestHelper.ajax('GET', AppConsts.remoteServiceBaseUrl + '/api/TokenAuth/LogOut', customHeaders, null, () => {
            abp.auth.clearToken();
            abp.utils.setCookieValue(AppConsts.authorization.encrptedAuthTokenName, undefined, undefined, abp.appPath);
            if (reload !== false) {
                if (returnUrl) {
                    location.href = returnUrl;
                }
                else {
                    location.href = '';
                }
            }
        });
    }
};
export { AppAuthService };
