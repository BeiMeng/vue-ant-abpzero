import { LocalStorageService } from '@/abpZero/shared/common/localStorage.Service'
import { AppConsts } from '@/abpZero/shared/AppConsts';
export class SignalRHelper {
    static initSignalR(callback) {
        new LocalStorageService().getItem(AppConsts.authorization.encrptedAuthTokenName, function (err, value) {
            let encryptedAuthToken;
            if(value!=null)
            {
                encryptedAuthToken = value.token;
            }
            abp.signalr = {
                autoConnect: true,
                connect: undefined,
                hubs: undefined,
                qs: AppConsts.authorization.encrptedAuthTokenName + '=' + encodeURIComponent(encryptedAuthToken),
                remoteServiceBaseUrl: AppConsts.remoteSignalrBaseUrl,
                startConnection: undefined,
                url: '/signalr'
            };
            let script = document.createElement('script');
            script.onload = () => {
                if(callback){
                    callback();
                }
            };
            script.src = AppConsts.appBaseUrl + '/static/abp-web-resources/abp.signalr-client.js';
            document.body.appendChild(script);
        })
    }
}
