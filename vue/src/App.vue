<template>
  <div id="app">
    <Header ref="header" />
    <div class="main-content">
      <router-view></router-view>
    </div>
    <footer class="footer">
      <div class="footer-content">
        <div class="logo">
          <img src="@/assets/logo.png" alt="Logo">
          <span>广东旅游</span>
        </div>
        <div class="footer-section">
          <h3>关于我们</h3>
          <p>广东旅游网致力于为游客提供最优质的旅游资讯和服务，让每一次旅行都充满精彩。</p>
        </div>
        <div class="footer-section">
          <h3>热门目的地</h3>
          <ul>
            <li><a href="#">广州长隆</a></li>
            <li><a href="#">深圳世界之窗</a></li>
            <li><a href="#">珠海海洋王国</a></li>
            <li><a href="#">韶关丹霞山</a></li>
          </ul>
        </div>
        <div class="footer-section">
          <h3>快速链接</h3>
          <ul>
            <li><a href="#">景点门票</a></li>
            <li><a href="#">特色美食</a></li>
            <li><a href="#">旅游攻略</a></li>
            <li><a href="#">帮助中心</a></li>
          </ul>
        </div>
        <div class="footer-section">
          <h3>联系我们</h3>
          <p>客服电话：400-123-4567</p>
          <p>营业时间：09:00-22:00</p>
          <div class="social-media">
            <i class="el-icon-chat-dot-round"></i>
            <i class="el-icon-phone"></i>
            <i class="el-icon-message"></i>
          </div>
        </div>
      </div>
      <div class="footer-bottom">
        <p>© 2024 广东旅游网 版权所有</p>
      </div>
    </footer>
  </div>
</template>

<script>
import Header from '@/components/common/Header.vue'

export default {
  name: 'App',
  components: {
    Header
  },
  created() {
    // 监听显示登录框事件
    this.$root.$on('show-login', () => {
      // 通知Header组件显示登录框
      this.$refs.header.login()
    })
  }
}
</script>

<style>
:root {
  --primary-color: #3B82F6;
  --primary-dark: #2563EB;
  --success-color: #10B981;
  --warning-color: #F59E0B;
  --danger-color: #EF4444;
  --text-primary: #1F2937;
  --text-secondary: #6B7280;
  --bg-primary: #FFFFFF;
  --bg-secondary: #F3F4F6;
  --accent-color: #8B5CF6;
  --border-color: #E5E7EB;
}

body {
  margin: 0;
  padding: 0;
  background-color: var(--bg-secondary);
  font-family: 'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  color: var(--text-primary);
  line-height: 1.6;
}

#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.main-content {
  margin-top: 60px;
  flex: 1;
  padding: 20px;
  box-sizing: border-box;
  max-width: 1400px;
  margin-left: auto;
  margin-right: auto;
  width: 100%;
}

/* 页面标题样式 */
.page-title {
  font-size: 28px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 24px;
  position: relative;
  padding-left: 15px;
}

.page-title::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 4px;
  height: 24px;
  background: var(--primary-color);
  border-radius: 2px;
}

/* 卡片样式优化 */
.el-card {
  border-radius: 16px;
  border: none;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  transition: all 0.3s ease;
  overflow: hidden;
}

.el-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

/* 按钮样式优化 */
.el-button {
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.el-button--primary {
  background: linear-gradient(135deg, var(--primary-color) 0%, var(--primary-dark) 100%);
  border: none;
}

.el-button--primary:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

/* 输入框样式优化 */
.el-input__inner {
  border-radius: 8px;
  border: 1px solid var(--border-color);
  transition: all 0.3s ease;
}

.el-input__inner:focus {
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

/* 对话框样式优化 */
.el-dialog {
  border-radius: 20px;
  overflow: hidden;
}

.el-dialog__header {
  padding: 20px 24px;
  border-bottom: 1px solid var(--border-color);
  background: var(--bg-primary);
}

.el-dialog__body {
  padding: 24px;
}

.el-dialog__footer {
  padding: 16px 24px;
  border-top: 1px solid var(--border-color);
  background: var(--bg-primary);
}

/* 页脚样式 */
.footer {
  background: #2B323B;
  color: #FFFFFF;
  padding: 60px 0 20px;
  margin-top: 60px;
}

.footer-content {
  max-width: 1400px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 40px;
  padding: 0 20px;
}

.footer-section h3 {
  font-size: 18px;
  margin-bottom: 20px;
  color: #FFFFFF;
}

.footer-section p {
  color: #94A3B8;
  margin: 0;
  line-height: 1.6;
}

.footer-section ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.footer-section ul li {
  margin-bottom: 12px;
}

.footer-section ul li a {
  color: #94A3B8;
  text-decoration: none;
  transition: color 0.3s;
}

.footer-section ul li a:hover {
  color: #FFFFFF;
}

.social-media {
  margin-top: 20px;
  display: flex;
  gap: 20px;
}

.social-media i {
  font-size: 24px;
  color: #94A3B8;
  cursor: pointer;
  transition: color 0.3s;
}

.social-media i:hover {
  color: #FFFFFF;
}

.footer-bottom {
  text-align: center;
  margin-top: 40px;
  padding-top: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.footer-bottom p {
  color: #94A3B8;
  margin: 0;
}

/* 滚动条样式 */
::-webkit-scrollbar {
  width: 10px;
  height: 10px;
}

::-webkit-scrollbar-track {
  background: #F3F4F6;
  border-radius: 5px;
}

::-webkit-scrollbar-thumb {
  background: linear-gradient(135deg, #CBD5E1 0%, #94A3B8 100%);
  border-radius: 5px;
  transition: all 0.3s;
}

::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(135deg, #94A3B8 0%, #64748B 100%);
}

/* 动画效果 */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter, .fade-leave-to {
  opacity: 0;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .main-content {
    padding: 20px;
  }
  
  .footer-content {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .footer-content {
    grid-template-columns: 1fr;
  }
  
  .page-title {
    font-size: 24px;
  }
}
</style>
