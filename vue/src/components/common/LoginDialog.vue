export default {
  data() {
    return {
      loginForm: {
        username: '',
        password: '',
        rememberMe: false
      },
      loginRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ]
      },
      visible: false
    }
  },
  methods: {
    async handleLogin() {
      try {
        const valid = await this.$refs.loginForm.validate()
        if (valid) {
          const { username, password, rememberMe } = this.loginForm
          
          if (rememberMe) {
            localStorage.setItem('username', username)
          } else {
            localStorage.removeItem('username')
          }

          localStorage.setItem('token', 'demo-token')
          
          this.$message.success('登录成功')
          this.visible = false
          this.$emit('login-success')
        }
      } catch (error) {
        console.error(error)
        this.$message.error('登录失败，请重试')
      }
    }
  }
} 

<template>
  <el-dialog
    title="登录"
    :visible.sync="visible"
    width="400px"
    center>
    <el-form
      ref="loginForm"
      :model="loginForm"
      :rules="loginRules"
      label-width="80px">
      <el-form-item label="用户名" prop="username">
        <el-input v-model="loginForm.username" placeholder="请输入用户名"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input
          v-model="loginForm.password"
          type="password"
          placeholder="请输入密码"
          @keyup.enter.native="handleLogin">
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-checkbox v-model="loginForm.rememberMe">记住密码</el-checkbox>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="handleLogin">登录</el-button>
    </span>
  </el-dialog>
</template> 