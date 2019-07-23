
let PermissionCheckerService = class PermissionCheckerService {
    isGranted(permissionName) {
        return abp.auth.isGranted(permissionName);
    }
};

export { PermissionCheckerService };
