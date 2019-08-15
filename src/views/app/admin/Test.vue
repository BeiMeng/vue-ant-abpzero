<template>
  <div>   
  <el-upload
    class="upload-demo"
    :action="uploadUrl"
    :headers="headers"
    multiple
    :on-success="onSuccess"
    :limit="3">
    <el-button size="small" type="primary">点击上传</el-button>
    <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
  </el-upload>  
  <el-button type="warning" @click="downLoad">下载文件</el-button>
  <el-input v-model="msg" placeholder=""></el-input>
  <el-button type="success" @click="sendMsg">消息推送</el-button>  
  </div>
</template>

<script>
import appconfig from '@/abpZero/appconfig'
import { TokenService } from '@/abpZero/abp-vue-module/auth/token.service';
import { FileDownloadService } from '@/abpZero/utils/file-download.service.js'
let _tokenService = new TokenService();
let _fileDownloadService = new FileDownloadService();
export default {
  name: 'admin_test',
  data() {
      return {
          uploadUrl: `${appconfig.remoteServiceBaseUrl}/File/Upload`,
          headers:{
            Authorization:'Bearer '+_tokenService.getToken()
          },
          uploadId:'',
          msg:''
      }
  },
  methods: {
    onSuccess(response,file,fileList) {
      console.log(response);
      this.uploadId=response.result;
    },
    downLoad(){
      _fileDownloadService.downloadUploadFile(this.uploadId)
    },
    sendMsg(){
      let url = "/api/TokenAuth/TestNotification";
      let params={
        message:this.msg,
        severity:'info'
      };
      httpClient.get(url, {
          params: params
      })
      .then(result => {
          console.log(result);
      })      
    }
  },
}
</script>

<style scoped>

</style>