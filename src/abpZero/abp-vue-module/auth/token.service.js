
let TokenService = class TokenService {
    getToken() {
        return abp.auth.getToken();
    }
    getTokenCookieName() {
        return abp.auth.tokenCookieName;
    }
    clearToken() {
        abp.auth.clearToken();
    }
    setToken(authToken, expireDate) {
        abp.auth.setToken(authToken, expireDate);
    }
};

export { TokenService };
