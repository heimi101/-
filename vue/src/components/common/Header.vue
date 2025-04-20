<template>
  <div class="header">
    <el-menu
      :default-active="activeIndex"
      mode="horizontal"
      router
      background-color="#2B323B"
      text-color="#94A3B8"
      active-text-color="#FFFFFF">
      
      <div class="logo">
        <img src="@/assets/logo.png" alt="Logo">
        <span>广东旅游</span>
      </div>

      <el-menu-item index="/">
        <i class="el-icon-s-home"></i>
        首页
      </el-menu-item>

      <el-menu-item index="/search">
        <i class="el-icon-search"></i>
        景点查询
      </el-menu-item>

      <div class="user-menu" v-if="isLoggedIn">
        <el-badge :value="3" class="notice-badge">
          <i class="el-icon-bell"></i>
        </el-badge>
        <el-dropdown trigger="click" @command="handleCommand">
          <span class="user-info">
            <img :src="userAvatar" class="avatar" v-if="userAvatar">
            <i class="el-icon-user" v-else></i>
            {{ userName }}
            <i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown" class="user-dropdown">
            <el-dropdown-item command="/profile">
              <i class="el-icon-user"></i> 个人信息
            </el-dropdown-item>
            <el-dropdown-item command="/orders">
              <i class="el-icon-tickets"></i> 订单记录
            </el-dropdown-item>
            <el-dropdown-item command="/favorites">
              <i class="el-icon-star-off"></i> 我的收藏
            </el-dropdown-item>
            <el-dropdown-item command="logout" divided>
              <i class="el-icon-switch-button"></i> 退出登录
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
      
      <div class="user-menu" v-else>
        <el-button type="text" @click="login">登录</el-button>
        <el-button type="primary" @click="register" class="register-btn">注册</el-button>
      </div>
    </el-menu>

    <!-- 登录对话框 -->
    <el-dialog title="登录" :visible.sync="loginDialogVisible" width="400px" custom-class="custom-dialog">
      <div class="dialog-header">
        <img src="@/assets/logo.png" alt="Logo" class="dialog-logo">
        <h3>欢迎回来</h3>
        <p>请登录您的账号</p>
      </div>
      <el-form :model="loginForm" :rules="loginRules" ref="loginForm">
        <el-form-item prop="username">
          <el-input v-model="loginForm.username" prefix-icon="el-icon-user" placeholder="用户名"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="loginForm.password" prefix-icon="el-icon-lock" type="password" placeholder="密码"></el-input>
        </el-form-item>
        <div class="form-footer">
          <el-checkbox v-model="rememberMe">记住我</el-checkbox>
          <a href="#" class="forgot-password">忘记密码？</a>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="loginDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleLogin">登录</el-button>
      </div>
    </el-dialog>

    <!-- 注册对话框 -->
    <el-dialog title="注册" :visible.sync="registerDialogVisible" width="400px" custom-class="custom-dialog">
      <div class="dialog-header">
        <img src="@/assets/logo.png" alt="Logo" class="dialog-logo">
        <h3>创建账号</h3>
        <p>开启您的旅游之旅</p>
      </div>
      <el-form :model="registerForm" :rules="registerRules" ref="registerForm">
        <el-form-item prop="username">
          <el-input v-model="registerForm.username" prefix-icon="el-icon-user" placeholder="用户名"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="registerForm.password" prefix-icon="el-icon-lock" type="password" placeholder="密码"></el-input>
        </el-form-item>
        <el-form-item prop="confirmPassword">
          <el-input v-model="registerForm.confirmPassword" prefix-icon="el-icon-lock" type="password" placeholder="确认密码"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="registerDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleRegister">注册</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { auth } from '@/utils/auth'

export default {
  name: 'Header',
  data() {
    const validatePass = (rule, value, callback) => {
      if (value !== this.registerForm.password) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      activeIndex: '/',
      isLoggedIn: false,
      userName: '',
      userAvatar: '',
      loginDialogVisible: false,
      registerDialogVisible: false,
      loginForm: {
        username: '',
        password: ''
      },
      registerForm: {
        username: '',
        password: '',
        confirmPassword: ''
      },
      loginRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ]
      },
      registerRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, message: '用户名长度不能小于3个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, message: '密码长度不能小于6个字符', trigger: 'blur' }
        ],
        confirmPassword: [
          { required: true, message: '请再次输入密码', trigger: 'blur' },
          { validator: validatePass, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    handleCommand(command) {
      if (command === 'logout') {
        this.handleLogout()
      } else {
        this.$router.push(command)
      }
    },
    login() {
      this.loginDialogVisible = true
    },
    register() {
      this.registerDialogVisible = true
    },
    async handleLogin() {
      try {
        const valid = await this.$refs.loginForm.validate()
        if (valid) {
          // 模拟登录API调用
          // const response = await axios.post('/api/login', this.loginForm)
          // 模拟返回数据
          const mockResponse = {
            token: 'mock_token_' + Date.now(),
            userInfo: {
              id: 1,
              username: this.loginForm.username,
              avatar: '',
              email: 'user@example.com',
              phone: '13800138000'
            }
          }

          // 保存登录信息
          auth.setToken(mockResponse.token)
          auth.setUserInfo(mockResponse.userInfo)

          // 更新组件状态
          this.isLoggedIn = true
          this.userName = mockResponse.userInfo.username
          this.userAvatar = mockResponse.userInfo.avatar
          
          this.loginDialogVisible = false
          this.$message.success('登录成功！')
          
          // 重置表单
          this.$refs.loginForm.resetFields()

          // 如果有重定向地址，则跳转
          const redirect = this.$route.query.redirect
          if (redirect) {
            this.$router.push(redirect)
          }
        }
      } catch (error) {
        console.error(error)
        this.$message.error('登录失败，请稍后重试')
      }
    },
    async handleRegister() {
      try {
        const valid = await this.$refs.registerForm.validate()
        if (valid) {
          // 模拟注册API调用
          // const response = await axios.post('/api/register', this.registerForm)
          
          this.registerDialogVisible = false
          this.$message.success('注册成功！请登录')
          
          // 重置表单并打开登录框
          this.$refs.registerForm.resetFields()
          this.loginDialogVisible = true
        }
      } catch (error) {
        console.error(error)
        this.$message.error('注册失败，请稍后重试')
      }
    },
    handleLogout() {
      this.$confirm('确定要退出登录吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 清除登录信息
        auth.clear()
        
        // 更新组件状态
        this.isLoggedIn = false
        this.userName = ''
        this.userAvatar = ''
        
        this.$message.success('已退出登录')
        
        // 如果当前页面需要登录，则跳转到首页
        if (this.$route.meta.requiresAuth) {
          this.$router.push('/')
        }
      }).catch(() => {})
    },
    checkLoginStatus() {
      const token = auth.getToken()
      if (token) {
        const userInfo = auth.getUserInfo()
        this.isLoggedIn = true
        this.userName = userInfo.username
        this.userAvatar = userInfo.avatar
      }
    }
  },
  watch: {
    '$route'(to) {
      this.activeIndex = to.path
    }
  },
  created() {
    this.activeIndex = this.$route.path
    this.checkLoginStatus()
  }
}
</script>

<style scoped>
.header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.logo {
  float: left;
  height: 60px;
  display: flex;
  align-items: center;
  padding: 0 20px;
  color: #FFFFFF;
  font-size: 20px;
  font-weight: bold;
}

.logo img {
  height: 40px;
  margin-right: 10px;
}

.user-menu {
  float: right;
  height: 60px;
  display: flex;
  align-items: center;
  margin-right: 20px;
  gap: 20px;
}

.user-info {
  color: #FFFFFF;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 5px 10px;
  border-radius: 20px;
  transition: all 0.3s;
}

.user-info:hover {
  background: rgba(255, 255, 255, 0.1);
}

.avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 2px solid rgba(255, 255, 255, 0.2);
}

.el-button--text {
  color: #94A3B8;
  font-weight: 500;
}

.el-button--text:hover {
  color: #FFFFFF;
}

.register-btn {
  background: #3B82F6;
  border: none;
  padding: 8px 20px;
  border-radius: 20px;
}

.register-btn:hover {
  background: #2563EB;
}

.notice-badge {
  margin-right: 20px;
  cursor: pointer;
}

.notice-badge i {
  font-size: 20px;
  color: #94A3B8;
}

/* 对话框样式 */
.custom-dialog {
  border-radius: 12px;
}

.dialog-header {
  text-align: center;
  margin-bottom: 30px;
}

.dialog-logo {
  width: 60px;
  margin-bottom: 15px;
}

.dialog-header h3 {
  margin: 0;
  font-size: 24px;
  color: #1F2937;
}

.dialog-header p {
  margin: 5px 0 0;
  color: #6B7280;
}

.form-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.forgot-password {
  color: #3B82F6;
  text-decoration: none;
}

.forgot-password:hover {
  text-decoration: underline;
}

.user-dropdown {
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

/* 菜单项样式 */
.el-menu-item {
  font-size: 15px;
  font-weight: 500;
  transition: all 0.3s;
}

.el-menu-item:hover {
  background-color: rgba(255, 255, 255, 0.1) !important;
}

.el-menu-item i {
  margin-right: 5px;
  font-size: 18px;
}
</style> 