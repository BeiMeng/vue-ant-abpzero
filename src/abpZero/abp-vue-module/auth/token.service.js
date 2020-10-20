
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
    //refresh token
    getRefreshToken() {
        return abp.auth.getRefreshToken();
    };
    getRefreshTokenCookieName() {
        return abp.auth.refreshTokenCookieName;
    };
    clearRefreshToken() {
        abp.auth.clearRefreshToken();
    };
    setRefreshToken(refreshToken, expireDate) {
        abp.auth.setRefreshToken(refreshToken, expireDate);
    };    
};

export { TokenService };
