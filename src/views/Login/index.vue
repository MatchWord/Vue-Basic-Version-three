<template>
<div class="main">
  <canvas id="loginAni"></canvas>
  <div class="login-wrapper">
      <div class="login-block">
          <div class="sys-logo">后台管理系统</div>
          <el-form class="login-form" ref="loginForm" :model="loginForm" :rules="loginRules" size="medium">
            <el-form-item prop="userAccount">
                <el-input
                  class="login-input"
                  type="text"
                  v-model="loginForm.userAccount"
                  placeholder="用户名">
                </el-input>
            </el-form-item>
            <el-form-item prop="userPassword">
              <el-input
                class="login-input"
                type="password"
                v-model="loginForm.userPassword"
                @keyup.enter.native="login('loginForm')"
                placeholder="密码">
              </el-input>
            </el-form-item>
            <el-form-item >
              <div style="margin-top:8px;">
                <el-button class="login-button" type="primary" :loading="isLoginning" @click="login('loginForm')">登录</el-button>
                <el-button @click="resetForm('loginForm')">重置</el-button>
              </div>
            </el-form-item>
         </el-form>
      </div>
  </div>
</div>
</template>

<script>
import { startAnimation } from './loginAni'

export default {
  name: 'Login',
  data () {
    return {
      isLoginning: false,
      loginForm: {
        userAccount: '',
        userPassword: ''
      },
      loginRules: {
        userAccount: [
          {required: true, message: '请输入用户名', trigger: 'blur'}
        ],
        userPassword: [
          {required: true, message: '请输入密码', trigger: 'blur'}
        ]
      }
    }
  },
  mounted () {
    startAnimation('loginAni')
  },
  methods: {
    login (formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.isLoginning = true
          // 调用store中的用户登陆
          this.$store.dispatch('user/login', {...this.loginForm}).then((res) => {
            // 成功跳到首页
            this.$router.push('/dashboard')
            // 之后将启用 permission.js
          }).finally(() => {
            this.isLoginning = false
          })
        } else {
          return false
        }
      })
    },
    resetForm (formName) {
      this.$refs[formName].resetFields()
    }
  }
}
</script>

<style lang="scss" scoped>
.main {
  display:flex;
  justify-content: center;
  width:100%;
  height:100%;

  .login-wrapper{
    position:relative;
    top:20%;
    height:300px;
    z-index:10;

    .login-block{
      position: absolute;
      display: flex;
      justify-content: center;
      left:50%;
      top:50%;
      width:300px;
      height:270px;
      padding:50px 0 40px 0;
      margin:-150px 0 0 -150px;
      border-radius:25px;
      box-sizing: border-box;
      background:rgba(255,255,255,.95);
      box-shadow:0 0 45px rgba(0,0,0,.18);

      .sys-logo {
      position: absolute;
      top: 25px;
      left: 20px;
      font-size: 2rem;
      letter-spacing: 3px;
      }

      .login-form {
        padding-top:25px;

        .login-input{
          width:220px;
        }

        .login-button {
          width:136px;
        }

      }

    }

  }
  .login-ani {
    position:absolute;
    top:0;
    left:0;
  }

}

</style>