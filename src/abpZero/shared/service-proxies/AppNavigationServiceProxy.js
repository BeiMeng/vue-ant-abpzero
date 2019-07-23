let AppNavigationServiceProxy = class AppNavigationServiceProxy {
    constructor() {
    }
    getMenuTree() {
        return httpClient.get("/api/services/app/Menu/GetMenuTree")        
    }
    getMenuById(id){
        return httpClient.get("/api/services/app/Menu/GetMenuForEdit",{
            params:{id:id}
        })
    }
    saveMenu(menu){
        return httpClient.post("/api/services/app/Menu/CreateOrUpdateMenuForOutput",menu)        
    }
    delMenu(id){
        return httpClient.delete("/api/services/app/Menu/DeleteMenu",{
            params: {id:id}
        })
    }
};
export { AppNavigationServiceProxy };