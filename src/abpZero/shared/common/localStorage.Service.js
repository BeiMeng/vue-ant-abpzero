import * as localForage from 'localforage';
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
