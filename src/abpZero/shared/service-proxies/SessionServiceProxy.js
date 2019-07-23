let SessionServiceProxy = class SessionServiceProxy {
    constructor() {
    }
    /**
     * @return Success
     */
    getCurrentLoginInformations() {   
        let url_ ="/api/services/app/Session/GetCurrentLoginInformations";
        url_ = url_.replace(/[?&]$/, "");
        //return httpClient.post(url_)  //6.3
        return httpClient.get(url_)  //6.4+
    }

    /**
     * @return Success
     */
    updateUserSignInToken() {
        let url_ = "/api/services/app/Session/UpdateUserSignInToken";
        url_ = url_.replace(/[?&]$/, "");

    }

};
export { SessionServiceProxy };