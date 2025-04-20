<template>
  <div class="profile">
    <el-card class="profile-card">
      <div class="profile-header">
        <h2>个人信息</h2>
        <el-button type="primary" size="small" @click="isEditing = true" v-if="!isEditing">
          编辑资料
        </el-button>
      </div>

      <el-form 
        ref="form" 
        :model="userInfo" 
        :rules="rules"
        label-width="100px"
        :disabled="!isEditing">
        
        <el-form-item label="头像" prop="avatar">
          <el-upload
            class="avatar-uploader"
            action="/api/upload"
            :show-file-list="false"
            :disabled="!isEditing"
            :on-success="handleAvatarSuccess">
            <img v-if="userInfo.avatar" :src="userInfo.avatar" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>

        <el-form-item label="用户名" prop="username">
          <el-input v-model="userInfo.username"></el-input>
        </el-form-item>

        <el-form-item label="手机号码" prop="phone">
          <el-input v-model="userInfo.phone"></el-input>
        </el-form-item>

        <el-form-item label="邮箱" prop="email">
          <el-input v-model="userInfo.email"></el-input>
        </el-form-item>

        <el-form-item label="性别" prop="gender">
          <el-radio-group v-model="userInfo.gender">
            <el-radio label="male">男</el-radio>
            <el-radio label="female">女</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item v-if="isEditing">
          <el-button type="primary" @click="saveProfile">保存</el-button>
          <el-button @click="cancelEdit">取消</el-button>
        </el-form-item>
      </el-form>

      <!-- 安全设置 -->
      <div class="security-settings">
        <h3>安全设置</h3>
        <el-button type="text" @click="showChangePasswordDialog">
          修改密码
        </el-button>
      </div>
    </el-card>

    <!-- 修改密码对话框 -->
    <el-dialog title="修改密码" :visible.sync="passwordDialogVisible" width="400px">
      <el-form :model="passwordForm" :rules="passwordRules" ref="passwordForm">
        <el-form-item label="原密码" prop="oldPassword">
          <el-input type="password" v-model="passwordForm.oldPassword"></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="newPassword">
          <el-input type="password" v-model="passwordForm.newPassword"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input type="password" v-model="passwordForm.confirmPassword"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="passwordDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="changePassword">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { auth } from '@/utils/auth'

export default {
  name: 'Profile',
  data() {
    const validatePass = (rule, value, callback) => {
      if (value !== this.passwordForm.newPassword) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      isEditing: false,
      userInfo: {
        avatar: '',
        username: '',
        phone: '',
        email: '',
        gender: 'male'
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        phone: [
          { required: true, message: '请输入手机号码', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱地址', trigger: 'blur' },
          { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
        ]
      },
      passwordDialogVisible: false,
      passwordForm: {
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
      },
      passwordRules: {
        oldPassword: [
          { required: true, message: '请输入原密码', trigger: 'blur' }
        ],
        newPassword: [
          { required: true, message: '请输入新密码', trigger: 'blur' },
          { min: 6, message: '密码长度不能小于6位', trigger: 'blur' }
        ],
        confirmPassword: [
          { required: true, message: '请再次输入新密码', trigger: 'blur' },
          { validator: validatePass, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    handleAvatarSuccess(res) {
      this.userInfo.avatar = res.url
    },
    saveProfile() {
      this.$refs.form.validate(valid => {
        if (valid) {
          // 保存到 localStorage
          auth.setUserInfo(this.userInfo)
          this.isEditing = false
          this.$message.success('保存成功')
        }
      })
    },
    cancelEdit() {
      this.isEditing = false
      // 重置表单数据
      this.getUserInfo()
    },
    showChangePasswordDialog() {
      this.passwordDialogVisible = true
    },
    changePassword() {
      this.$refs.passwordForm.validate(valid => {
        if (valid) {
          // 调用修改密码API
          this.passwordDialogVisible = false
          this.$message.success('密码修改成功')
        }
      })
    },
    getUserInfo() {
      // 从 localStorage 获取用户信息
      const userInfo = auth.getUserInfo()
      if (userInfo) {
        this.userInfo = {
          avatar: userInfo.avatar || require('@/assets/logo.png'),
          username: userInfo.username || '',
          phone: userInfo.phone || '',
          email: userInfo.email || '',
          gender: userInfo.gender || 'male'
        }
      } else {
        // 如果没有用户信息，跳转到首页
        this.$message.warning('请先登录')
        this.$router.push('/')
      }
    }
  },
  created() {
    this.getUserInfo()
  }
}
</script>

<style scoped>
.profile {
  padding: 20px;
}

.profile-card {
  max-width: 800px;
  margin: 0 auto;
}

.profile-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.avatar-uploader {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  width: 120px;
  height: 120px;
}

.avatar-uploader:hover {
  border-color: #409EFF;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 120px;
  height: 120px;
  line-height: 120px;
  text-align: center;
}

.avatar {
  width: 120px;
  height: 120px;
  display: block;
}

.security-settings {
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid #eee;
}
</style> 