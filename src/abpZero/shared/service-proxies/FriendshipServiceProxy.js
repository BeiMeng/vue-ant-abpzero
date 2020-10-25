export class FriendshipServiceProxy {
    constructor() {
    }    
    /**
     * @param body (optional) 
     * @return Success
     */
    createFriendshipRequest(createFriendshipRequestInput){
        let url_ ="/api/services/app/Friendship/CreateFriendshipRequest";
        url_ = url_.replace(/[?&]$/, "");
        return httpClient.post(url_,createFriendshipRequestInput);
    }

    /**
     * @param body (optional) 
     * @return Success
     */
    createFriendshipRequestByUserName(createFriendshipRequestByUserNameInput){
        let url_ ="/api/services/app/Friendship/CreateFriendshipRequestByUserName";
        url_ = url_.replace(/[?&]$/, "");
        return httpClient.post(url_,createFriendshipRequestByUserNameInput);
    }
    /**
     * @param body (optional) 
     * @return Success
     */
    blockUser(blockUserInput){
        let url_ = "/api/services/app/Friendship/BlockUser";
        url_ = url_.replace(/[?&]$/, "");
        return httpClient.post(url_,blockUserInput);
    }

    /**
     * @param body (optional) 
     * @return Success
     */
    unblockUser(unblockUserInput){
        let url_ ="/api/services/app/Friendship/UnblockUser";
        url_ = url_.replace(/[?&]$/, "");
        return httpClient.post(url_,unblockUserInput);
    }
    /**
     * @param body (optional) 
     * @return Success
     */
    acceptFriendshipRequest(acceptFriendshipRequestInput){
        let url_ = "/api/services/app/Friendship/AcceptFriendshipRequest";
        url_ = url_.replace(/[?&]$/, "");
        return httpClient.post(url_,acceptFriendshipRequestInput);
    }
}