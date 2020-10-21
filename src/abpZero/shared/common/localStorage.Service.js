import * as localForage from 'localforage';
localForage.setDriver(localForage.LOCALSTORAGE); //强制使用localStorage存储。todo 目前在发布环境，默认使用IndexedDB存储失效，开发环境OK
let LocalStorageService = class LocalStorageService {
    constructor() {

    }
    getItem(key,callback){
        if (!localForage) {
            return;
        }

        localForage.getItem(key, callback);
    }


    setItem(key, value, callback){
        if (!localForage) {
            return;
        }

        if (value === null) {
            value = undefined;
        }
        localForage.setItem(key, value, callback);
    }

    removeItem(key, callback){
        if (!localForage) {
            return;
        }

        localForage.removeItem(key, callback);
    }    

};
export { LocalStorageService };
