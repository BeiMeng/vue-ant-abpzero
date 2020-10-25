<style lang='less' scoped>
  .app_layout_chatMessageItem{

  }
</style>

<template>
  <div class="app_layout_chatMessageItem">
        <a v-if="chatMessageType === 'image'" :href="chatMessage" target="_blank">
            <img :src="chatMessage" class="chat-image-preview" />
        </a>
        <a v-if="chatMessageType === 'file'" :href="chatMessage" target="_blank" class="chat-file-preview">
            <i class="fa fa-file"></i>
            {{fileName}}
            <i class="fa fa-download pull-right"></i>
        </a>
        <a v-if="chatMessageType === 'link'" :href="chatMessage" target="_blank" class="chat-link-message">
            <i class="fa fa-link"></i>
            {{chatMessage}}
        </a>
        <span v-if="chatMessageType === 'text'" v-html="chatMessage">
        </span>
  </div>
</template>

<script>
import { AppConsts } from '@/abpZero/shared/AppConsts'
import { LocalStorageService } from '@/abpZero/shared/common/localStorage.Service'
let _localStorageService = new LocalStorageService()
export default {
  name: 'app_layout_chatMessageItem',
  props: {
      message: {
          type: Object,
          default: {}
      },
  },
  data() { 
    return {
        chatMessage: '',
        chatMessageType: '',
        fileName: ''
    }
  },
  created () {
      this.setChatMessageType();
  },
  methods: {
      setChatMessageType() {
        const self = this;
        _localStorageService.getItem(AppConsts.authorization.encrptedAuthTokenName, function (err, value) {
            let encryptedAuthToken;
            if(value!=null)
            {
                encryptedAuthToken = value.token;
            }
            if (self.message.message.startsWith('[image]')) {
                self.chatMessageType = 'image';

                let image = JSON.parse(self.message.message.substring('[image]'.length));
                self.chatMessage = AppConsts.remoteServiceBaseUrl +
                    '/Chat/GetUploadedObject?fileId=' +
                    image.id +
                    '&fileName=' +
                    image.name +
                    '&contentType=' +
                    image.contentType + '&' + AppConsts.authorization.encrptedAuthTokenName + '=' + encodeURIComponent(encryptedAuthToken);

            } else if (self.message.message.startsWith('[file]')) {
                self.chatMessageType = 'file';

                let file = JSON.parse(self.message.message.substring('[file]'.length));
                self.chatMessage = AppConsts.remoteServiceBaseUrl +
                    '/Chat/GetUploadedObject?fileId=' +
                    file.id +
                    '&fileName=' +
                    file.name +
                    '&contentType=' +
                    file.contentType + '&' + AppConsts.authorization.encrptedAuthTokenName + '=' + encodeURIComponent(encryptedAuthToken);

                    self.fileName = file.name;
            } else if (self.message.message.startsWith('[link]')) {
                self.chatMessageType = 'link';
                let linkMessage = JSON.parse(self.message.message.substring('[link]'.length));
                self.chatMessage = linkMessage.message == null ? '' : linkMessage.message;
            } else {
                self.chatMessageType = 'text';
                self.chatMessage = self.message.message;
            }
        });          
      }
  },
 }
</script>