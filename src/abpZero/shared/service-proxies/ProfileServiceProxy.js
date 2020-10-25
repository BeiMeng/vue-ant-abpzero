export class ProfileServiceProxy {


    constructor() {

    }

    /**
     * @return Success
     */
    getCurrentUserProfileForEdit(){
        let url_ = "/api/services/app/Profile/GetCurrentUserProfileForEdit";
        url_ = url_.replace(/[?&]$/, "");
        return httpClient.get(url_);
    }


    /**
     * @param body (optional) 
     * @return Success
     */
    sendVerificationSms(sendVerificationSmsInputDto){
        let url_ = "/api/services/app/Profile/SendVerificationSms";
        url_ = url_.replace(/[?&]$/, "");
        return httpClient.post(url_,sendVerificationSmsInputDto);
    }

    /**
     * @param body (optional) 
     * @return Success
     */
    verifySmsCode(verifySmsCodeInputDto){
        let url_ = "/api/services/app/Profile/VerifySmsCode";
        url_ = url_.replace(/[?&]$/, "");
        return httpClient.post(url_,verifySmsCodeInputDto);
    }

    /**
     * @param body (optional) 
     * @return Success
     */
    updateCurrentUserProfile(currentUserProfileEditDto){
        let url_ ="/api/services/app/Profile/UpdateCurrentUserProfile";
        url_ = url_.replace(/[?&]$/, "");
        return httpClient.put(url_,currentUserProfileEditDto);
    }


    /**
     * @param body (optional) 
     * @return Success
     */
    changePassword(changePasswordInput) {
        let url_ = "/api/services/app/Profile/ChangePassword";
        url_ = url_.replace(/[?&]$/, "");
        return httpClient.post(url_,changePasswordInput);
    }

    /**
     * @param body (optional) 
     * @return Success
     */
    updateProfilePicture(updateProfilePictureInput){
        let url_ = "/api/services/app/Profile/UpdateProfilePicture";
        url_ = url_.replace(/[?&]$/, "");
        return httpClient.post(url_,updateProfilePictureInput);
    }

    /**
     * @return Success
     */
    getPasswordComplexitySetting(){
        let url_ = "/api/services/app/Profile/GetPasswordComplexitySetting";
        url_ = url_.replace(/[?&]$/, "");
        return httpClient.get(url_);
    }

    /**
     * @return Success
     */
    getProfilePicture(){
        let url_ ="/api/services/app/Profile/GetProfilePicture";
        url_ = url_.replace(/[?&]$/, "");
        return httpClient.get(url_);
    }

    /**
     * @param username (optional) 
     * @return Success
     */
    getProfilePictureByUserName(username){
        let url_ = this.baseUrl + "/api/services/app/Profile/GetProfilePictureByUserName?";
        if (username !== undefined)
            url_ += "username=" + encodeURIComponent("" + username) + "&"; 
        url_ = url_.replace(/[?&]$/, "");
        return httpClient.get(url_);
    }

    /**
     * @param userId (optional) 
     * @param tenantId (optional) 
     * @return Success
     */
    getFriendProfilePicture(userId, tenantId){
        let url_ = "/api/services/app/Profile/GetFriendProfilePicture?";
        if (userId === null)
            throw new Error("The parameter 'userId' cannot be null.");
        else if (userId !== undefined)
            url_ += "UserId=" + encodeURIComponent("" + userId) + "&"; 
        if (tenantId !== undefined)
            url_ += "TenantId=" + encodeURIComponent("" + tenantId) + "&"; 
        url_ = url_.replace(/[?&]$/, "");
        return httpClient.get(url_);
    }

    /**
     * @param userId (optional) 
     * @return Success
     */
    getProfilePictureByUser(userId){
        let url_ = this.baseUrl + "/api/services/app/Profile/GetProfilePictureByUser?";
        if (userId === null)
            throw new Error("The parameter 'userId' cannot be null.");
        else if (userId !== undefined)
            url_ += "userId=" + encodeURIComponent("" + userId) + "&"; 
        url_ = url_.replace(/[?&]$/, "");
        return httpClient.get(url_);
    }
    /**
     * @param body (optional) 
     * @return Success
     */
    changeLanguage(changeUserLanguageDto){
        let url_ = "/api/services/app/Profile/ChangeLanguage";
        url_ = url_.replace(/[?&]$/, "");
        return httpClient.post(url_,changeUserLanguageDto);
    }
}