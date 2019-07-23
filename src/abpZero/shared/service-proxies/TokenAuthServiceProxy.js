let TokenAuthServiceProxy = class TokenAuthServiceProxy {
    constructor() {
    }
    /**
     * @param model (optional)
     * @return Success
     */
    authenticate(model) {
        let url_ ="/api/TokenAuth/Authenticate";
        url_ = url_.replace(/[?&]$/, "");
        return httpClient.post(url_, model) 
    }
    /**
     * @return Success
     */
    logOut() {
        let url_ = "/api/TokenAuth/LogOut";
        url_ = url_.replace(/[?&]$/, "");
        return httpClient.get(url_)
    }
    /**
     * @param message (optional)
     * @param severity (optional)
     * @return Success
     */
    testNotification(message, severity) {
        let url_ = "/api/TokenAuth/TestNotification?";
        if (message !== undefined)
            url_ += "message=" + encodeURIComponent("" + message) + "&";
        if (severity !== undefined)
            url_ += "severity=" + encodeURIComponent("" + severity) + "&";
        url_ = url_.replace(/[?&]$/, "");
    }

};

export { TokenAuthServiceProxy };