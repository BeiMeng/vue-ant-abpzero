import { AppConsts } from '@/abpZero/shared/AppConsts';
import { PermissionCheckerService } from '@/abpZero/abp-vue-module/auth/permission-checker.service';
import { LocalizationService } from '@/abpZero/abp-vue-module/localization/localization.service';
import { ArrayToTreeConverterService } from '@/abpZero/utils/array-to-tree-converter.service.js';
import * as moment from 'moment';
let _localization=new LocalizationService();
let _permission=new PermissionCheckerService();
let _arrayToTreeConverterService=new ArrayToTreeConverterService();
const abpMixin={
    methods: {
        l(key, ...args) {
            args.unshift(key);
            args.unshift(AppConsts.localization.defaultLocalizationSourceName);
            return this.ls.apply(this, args);
        },
        ls(sourcename, key, ...args) {
            let localizedText = _localization.localize(key, sourcename);
            if (!localizedText) {
                localizedText = key;
            }
            if (!args || !args.length) {
                return localizedText;
            }
            args.unshift(localizedText);
            return abp.utils.formatString.apply(this, args);
        },
        isGranted(permissionName) {
            return _permission.isGranted(permissionName);
        },
        isGrantedAny(...permissions) {
            if (!permissions) {
                return false;
            }
            for (const permission of permissions) {
                if (this.isGranted(permission)) {
                    return true;
                }
            }
            return false;
        },
        s(key) {
            return abp.setting.get(key);
        },
        dateTimeFormat(time,foramt){
            if(time==="" || time===null || time===undefined){
                return time;
            }
            if(foramt===undefined){
                foramt='YYYY-MM-DD HH:mm:ss';
            }
            return moment(time).format(foramt);
        },
        arrayToTreeConverter(array, parentIdProperty, idProperty, parentIdValue, childrenProperty,warp,mappingList){
            return _arrayToTreeConverterService.createTree(array, parentIdProperty, idProperty, parentIdValue, childrenProperty,warp,mappingList);
        }
    }
}
export default abpMixin;