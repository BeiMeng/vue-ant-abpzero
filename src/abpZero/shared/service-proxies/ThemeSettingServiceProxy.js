let ThemeSettingServiceProxy = class ThemeSettingServiceProxy {
    constructor() {
    }
    saveThemeSetting(theme){
        return httpClient.post("/api/services/app/ThemeSetting/SettingTheme",theme)        
    }
};
export { ThemeSettingServiceProxy };