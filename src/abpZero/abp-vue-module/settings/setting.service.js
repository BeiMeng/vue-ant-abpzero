let SettingService = class SettingService {
    get(name) {
        return abp.setting.get(name);
    }
    getBoolean(name) {
        return abp.setting.getBoolean(name);
    }
    getInt(name) {
        return abp.setting.getInt(name);
    }
};
export { SettingService };
