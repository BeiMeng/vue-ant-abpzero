
let ChatSignalrService = class ChatSignalrService{
    constructor() {
        this.chatHub=null;
        this.isChatConnected = false;
    }
    configureConnection(connection) {
        // Set the common hub
        this.chatHub = connection;
        // Reconnect loop
        let reconnectTime = 5000;
        let tries = 1;
        let maxTries = 8;
        function start() {
            return new Promise(function (resolve, reject) {
                if (tries > maxTries) {
                    reject();
                }
                else {
                    connection.start()
                        .then(resolve)
                        .then(() => {
                        reconnectTime = 5000;
                        tries = 1;
                    })
                        .catch(() => {
                        setTimeout(() => {
                            start().then(resolve);
                        }, reconnectTime);
                        reconnectTime *= 2;
                        tries += 1;
                    });
                }
            });
        }
        // Reconnect if hub disconnects
        connection.onclose(e => {
            this.isChatConnected = false;
            if (e) {
                abp.log.debug('Chat connection closed with error: ' + e);
            }
            else {
                abp.log.debug('Chat disconnected');
            }
            start().then(() => {
                this.isChatConnected = true;
            });
        });
        // Register to get notifications
        this.registerChatEvents(connection);
    }
    registerChatEvents(connection) {
        connection.on('getChatMessage', message => {
            abp.event.trigger('app.chat.messageReceived', message);
        });
        connection.on('getAllFriends', friends => {
            abp.event.trigger('abp.chat.friendListChanged', friends);
        });
        connection.on('getFriendshipRequest', (friendData, isOwnRequest) => {
            abp.event.trigger('app.chat.friendshipRequestReceived', friendData, isOwnRequest);
        });
        connection.on('getUserConnectNotification', (friend, isConnected) => {
            abp.event.trigger('app.chat.userConnectionStateChanged', {
                friend: friend,
                isConnected: isConnected
            });
        });
        connection.on('getUserStateChange', (friend, state) => {
            abp.event.trigger('app.chat.userStateChanged', {
                friend: friend,
                state: state
            });
        });
        connection.on('getallUnreadMessagesOfUserRead', friend => {
            abp.event.trigger('app.chat.allUnreadMessagesOfUserRead', {
                friend: friend
            });
        });
        connection.on('getReadStateChange', friend => {
            abp.event.trigger('app.chat.readStateChange', {
                friend: friend
            });
        });
    }
    sendMessage(messageData, callback) {
        if (!this.isChatConnected) {
            if (callback) {
                callback();
            }
            abp.notify.warn('ChatIsNotConnectedWarning');
            return;
        }
        this.chatHub.invoke('sendMessage', messageData).then(result => {
            if (result) {
                abp.notify.warn(result);
            }
            if (callback) {
                callback();
            }
        }).catch(error => {
            abp.log.error(error);
            if (callback) {
                callback();
            }
        });
    }
    init() {
        abp.signalr.connect();
        abp.signalr.startConnection(abp.appPath + 'signalr-chat', connection => {
            this.configureConnection(connection);
        }).then(() => {
            abp.event.trigger('app.chat.connected');
            this.isChatConnected = true;
        });
    }
};
export { ChatSignalrService };
