
let PermissionCheckerService = class PermissionCheckerService {
    isGranted(permissionName) {
        return abp.auth.isGranted(permissionName);
    }
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
    }
};

export { PermissionCheckerService };
