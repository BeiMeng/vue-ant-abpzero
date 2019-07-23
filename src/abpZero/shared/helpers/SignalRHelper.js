import { UtilsService } from '@/abpZero/abp-vue-module/utils/utils.service';
import { AppConsts } from '@/abpZero/shared/AppConsts';
export class SignalRHelper {
    static initSignalR(callback) {
        let encryptedAuthToken = new UtilsService().getCookieValue(AppConsts.authorization.encrptedAuthTokenName);
        abp.signalr = {
            autoConnect: true,
            connect: undefined,
            hubs: undefined,
            qs: AppConsts.authorization.encrptedAuthTokenName + '=' + encodeURIComponent(encryptedAuthToken),
            remoteServiceBaseUrl: AppConsts.remoteServiceBaseUrl,
            startConnection: undefined,
            url: '/signalr'
        };
        let script = document.createElement('script');
        script.onload = () => {
            callback();
        };
        script.src = AppConsts.appBaseUrl + '/static/abp-web-resources/abp.signalr-client.js';
        document.body.appendChild(script);
    }
}
