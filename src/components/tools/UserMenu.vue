<template>
  <div class="user-wrapper">
    <div class="content-box">
      <chatBar></chatBar>
      <a href="https://www.baidu.com" target="_blank">
        <span class="action">
          <a-icon type="question-circle-o"></a-icon>
        </span>
      </a>
      <notice-icon class="action"/>
      <a-dropdown>
        <span class="action ant-dropdown-link user-dropdown-menu">
          <a-avatar class="avatar" size="small" :src="avatar()"/>
          <span>{{ nickname() }}</span>
        </span>
        <a-menu slot="overlay" class="user-dropdown-menu-wrapper">
          <!-- <a-menu-item key="0">
            <router-link :to="{ name: 'center' }">
              <a-icon type="user"/>
              <span>个人中心</span>
            </router-link>
          </a-menu-item>
          <a-menu-item key="1">
            <router-link :to="{ name: 'settings' }">
              <a-icon type="setting"/>
              <span>账户设置</span>
            </router-link>
          </a-menu-item> -->
          <!-- <a-menu-item key="2" disabled>
            <a-icon type="setting"/>
            <span>测试</span>
          </a-menu-item> -->
          <a-menu-item key="2">
            <a href="javascript:;" @click="changePwd">
              <a-icon type="setting"/>
              <span>{{l("修改密码")}}</span>
            </a>            
          </a-menu-item>          
          <a-menu-divider/>
          <a-menu-item key="3">
            <a href="javascript:;" @click="handleLogout">
              <a-icon type="logout"/>
              <span>退出登录</span>
            </a>
          </a-menu-item>
        </a-menu>
      </a-dropdown>

    </div>
    <a-modal
      :title="l('密码修改')"
      :visible="visible"
      :confirm-loading="confirmLoading"
      @ok="handleOk"
      @cancel="handleCancel"
    >
        <el-form :model="mainForm" ref="mainForm" :rules="mainFormRule" label-width="100px">
            <el-form-item :label="l('旧密码')" prop="password">
                <el-input v-model="mainForm.password" placeholder="" show-password></el-input>
            </el-form-item>            
            <el-form-item :label="l('新密码')" prop="newPassword">
                <el-input v-model="mainForm.newPassword" placeholder="" show-password></el-input>
            </el-form-item>  
            <el-form-item :label="l('确认新密码')" prop="againPassword">
                <el-input v-model="mainForm.againPassword" placeholder="" show-password></el-input>
            </el-form-item>                             
        </el-form>
    </a-modal>    
  </div>
</template>

<script>
import chatBar from '@/views/app/layout/chat/ChatBar'
import NoticeIcon from '@/components/NoticeIcon'
import { mapActions, mapGetters } from 'vuex'
import { AppAuthService } from '@/abpZero/app/shared/common/auth/app-auth.service'
import { result } from 'lodash'
let _appAuthService = new AppAuthService()
export default {
  name: 'UserMenu',
  components: {
    NoticeIcon,chatBar
  },
  computed: {
    userId () {
        return this.$store.getters.userInfo.userId
    } 
  },   
  data() {
    var validatePassAgain = (rule, value, callback) => {
        if (value === '') {
          callback(new Error(this.l('请再次输入密码')));
        } else if (value !== this.mainForm.newPassword) {
          callback(new Error(this.l('两次输入密码不一致!')));
        } else {
          callback();
        }
    };     
    return {
      visible: false,
      confirmLoading: false,
      mainForm:{
        password:'',
        newPassword:'',
        againPassword:''
      },
      mainFormRule:{
        password: [
            { required: true, message: this.l('旧密码为必须项'), trigger: 'blur' },
            { min: 2, max: 50, message: this.l('长度在 2 到 50 个字符'), trigger: 'blur' }
        ],
        newPassword: [
            { required: true, message: this.l('新密码为必须项'), trigger: 'blur' },
            { min: 2, max: 50, message: this.l('长度在 2 到 50 个字符'), trigger: 'blur' }
        ],        
        againPassword: [
            { required: true,validator: validatePassAgain, trigger: 'blur' }
        ], 
      }     
    }
  },  
  methods: {
    ...mapActions(['Logout']),
    ...mapGetters(['nickname', 'avatar']),
    handleLogout () {
      const that = this

      this.$confirm({
        title: '提示',
        content: '真的要注销登录吗 ?',
        onOk () {
          // return that.Logout({}).then(() => {
          //   window.location.reload()
          // }).catch(err => {
          //   that.$message.error({
          //     title: '错误',
          //     description: err.message
          //   })
          // })
          _appAuthService.logout(true, '/')
        },
        onCancel () {
        }
      })
    },
    changePwd(){
      this.visible = true;
      this.mainForm.password='';
      this.mainForm.newPassword='';
      this.mainForm.againPassword='';
    },
    handleOk(e) {
      this.$refs['mainForm'].validate((valid) => {
          if (!valid) { // 表单验证失败
              return false
          }
          this.confirmLoading = true;
          httpClient.get('/api/services/app/Profile/GetCurrentUserProfileForEdit')
          .then(result=>{
            console.log(result);          
          })           
          httpClient.post('/api/services/app/Profile/ChangePassword',{
              currentPassword:this.mainForm.password,
              newPassword:this.mainForm.newPassword
          })
          .then(result=>{
            this.visible = false;
            this.$message.success(this.l('密码修改成功!'));
             _appAuthService.logout(true, '/')           
            // console.log(result);
            // if(result.success){
            //     this.visible = false;
            //     this.$message.success(this.l('密码修改成功!'));
            //     this.logOut();
            // }else{
            //     abp.message.error(result.message,this.l('错误'))
            // }          
          })
          .finally(()=>{
            this.confirmLoading = false;
          })          
      })
    },
    handleCancel(e) {
      this.visible = false;
    },    
  }
}
</script>
