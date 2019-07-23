let UserServiceProxy = class UserServiceProxy {
    constructor() {
    }
    /**
     * @return Success
     */
    /**
     * @param filter (optional)
     * @param permission (optional)
     * @param role (optional)
     * @param onlyLockedUsers (optional)
     * @param sorting (optional)
     * @param maxResultCount (optional)
     * @param skipCount (optional)
     * @return Success
     */
    getUsers(filter, permission, role, onlyLockedUsers, sorting, maxResultCount, skipCount) {
        let url_ = this.baseUrl + "/api/services/app/User/GetUsers?";
        if (filter !== undefined)
            url_ += "Filter=" + encodeURIComponent("" + filter) + "&";
        if (permission !== undefined)
            url_ += "Permission=" + encodeURIComponent("" + permission) + "&";
        if (role !== undefined)
            url_ += "Role=" + encodeURIComponent("" + role) + "&";
        if (onlyLockedUsers !== undefined)
            url_ += "OnlyLockedUsers=" + encodeURIComponent("" + onlyLockedUsers) + "&";
        if (sorting !== undefined)
            url_ += "Sorting=" + encodeURIComponent("" + sorting) + "&";
        if (maxResultCount !== undefined)
            url_ += "MaxResultCount=" + encodeURIComponent("" + maxResultCount) + "&";
        if (skipCount !== undefined)
            url_ += "SkipCount=" + encodeURIComponent("" + skipCount) + "&";
        url_ = url_.replace(/[?&]$/, "");
        return httpClient.get(url_)
    }

};
export { UserServiceProxy };