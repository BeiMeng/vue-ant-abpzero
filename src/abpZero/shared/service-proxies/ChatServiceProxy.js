let ChatServiceProxy = class ChatServiceProxy {
    constructor() {
    }
    getUserChatFriendsWithSettings() {
        return httpClient.get("/api/services/app/Chat/GetUserChatFriendsWithSettings")        
    }
    getUserChatMessages(tenantId, userId, minMessageId){
        let url_ ="/api/services/app/Chat/GetUserChatMessages?";
        if (tenantId !== undefined)
            url_ += "TenantId=" + encodeURIComponent("" + tenantId) + "&"; 
        if (userId === null)
            throw new Error("The parameter 'userId' cannot be null.");
        else if (userId !== undefined)
            url_ += "UserId=" + encodeURIComponent("" + userId) + "&"; 
        if (minMessageId !== undefined)
            url_ += "MinMessageId=" + encodeURIComponent("" + minMessageId) + "&"; 
        url_ = url_.replace(/[?&]$/, "");        
        return httpClient.get(url_)
    }
    markAllUnreadMessagesOfUserAsRead(markAllUnreadMessagesOfUserAsReadInput){
        return httpClient.post("/api/services/app/Chat/MarkAllUnreadMessagesOfUserAsRead",markAllUnreadMessagesOfUserAsReadInput)        
    }
};
export { ChatServiceProxy };