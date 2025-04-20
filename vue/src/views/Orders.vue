<template>
  <div class="orders">
    <div class="page-header">
      <h1>我的订单</h1>
      <div class="status-tabs">
        <div 
          v-for="tab in statusTabs" 
          :key="tab.value"
          :class="['status-tab', { active: orderStatus === tab.value }]"
          @click="handleStatusChange(tab.value)">
          {{ tab.label }}
          <span class="count" v-if="tab.count">{{ tab.count }}</span>
        </div>
      </div>
    </div>

    <div class="order-list">
      <div 
        v-for="order in orders" 
        :key="order.orderId" 
        :id="order.orderId" 
        class="order-card">
        <div class="order-header">
          <div class="order-number">
            订单号：{{ order.orderId }}
          </div>
          <div :class="['order-status', order.status]">
            {{ getStatusText(order.status) }}
          </div>
        </div>

        <div class="order-content">
          <div class="spot-image">
            <img :src="order.spotImage" :alt="order.spotName">
            <div class="spot-tag">景区门票</div>
          </div>
          
          <div class="order-details">
            <h3 class="spot-name">{{ order.spotName }}</h3>
            <div class="visit-info">
              <div class="info-item">
                <i class="el-icon-date"></i>
                <span>游玩日期：{{ formatDate(order.visitDate) }}</span>
              </div>
              <div class="info-item">
                <i class="el-icon-ticket"></i>
                <span>{{ order.ticketType }} × {{ order.quantity }}</span>
              </div>
              <div class="info-item">
                <i class="el-icon-user"></i>
                <span>游客：{{ order.contactName }}</span>
              </div>
            </div>
          </div>

          <div class="order-actions">
            <div class="price-box">
              <small>总价</small>
              <div class="total-price">
                <span class="currency">¥</span>
                <span class="amount">{{ order.totalPrice }}</span>
              </div>
            </div>
            
            <div class="action-buttons">
              <template v-if="order.status === 'pending'">
                <button class="btn btn-cancel" @click="handleCancel(order.orderId)">取消订单</button>
                <button class="btn btn-primary" @click="handlePay(order.orderId)">立即支付</button>
              </template>
              <template v-if="['paid', 'completed'].includes(order.status)">
                <button class="btn btn-qr" @click="showQRCode(order)">
                  <i class="el-icon-tickets"></i>
                  查看门票
                </button>
              </template>
            </div>
          </div>
        </div>

        <div class="order-footer">
          <div class="create-time">
            <i class="el-icon-time"></i>
            下单时间：{{ formatDateTime(order.createTime) }}
          </div>
          <div v-if="order.status === 'paid'" class="reminder">
            <i class="el-icon-warning-outline"></i>
            请在游玩日期前完成使用，过期将自动失效
          </div>
        </div>
      </div>
    </div>

    <!-- 空状态 -->
    <div v-if="orders.length === 0" class="empty-state">
      <div class="empty-icon">
        <svg width="160" height="160" viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M80 150c38.66 0 70-31.34 70-70s-31.34-70-70-70-70 31.34-70 70 31.34 70 70 70z" fill="#F3F4F6"/>
          <path d="M116 60H44c-2.21 0-4 1.79-4 4v48c0 2.21 1.79 4 4 4h72c2.21 0 4-1.79 4-4V64c0-2.21-1.79-4-4-4z" fill="#E5E7EB"/>
          <path d="M112 56H48c-2.21 0-4 1.79-4 4v48c0 2.21 1.79 4 4 4h64c2.21 0 4-1.79 4-4V60c0-2.21-1.79-4-4-4z" fill="white"/>
          <path d="M104 72H56c-1.1 0-2 .9-2 2v4c0 1.1.9 2 2 2h48c1.1 0 2-.9 2-2v-4c0-1.1-.9-2-2-2z" fill="#E5E7EB"/>
          <path d="M88 88H56c-1.1 0-2 .9-2 2v4c0 1.1.9 2 2 2h32c1.1 0 2-.9 2-2v-4c0-1.1-.9-2-2-2z" fill="#E5E7EB"/>
        </svg>
      </div>
      <p>暂无相关订单</p>
      <router-link to="/" class="btn btn-primary">去逛逛</router-link>
    </div>

    <!-- 分页 -->
    <div class="custom-pagination" v-if="orders.length > 0">
      <div 
        v-for="page in totalPages" 
        :key="page"
        :class="['page-number', { active: currentPage === page }]"
        @click="handlePageChange(page)">
        {{ page }}
      </div>
    </div>

    <!-- 二维码弹窗 -->
    <el-dialog 
      :visible.sync="qrDialogVisible" 
      width="360px" 
      custom-class="ticket-dialog"
      :show-close="false">
      <div class="ticket-card">
        <div class="ticket-header">
          <img src="@/assets/logo.png" alt="Logo" class="logo">
          <h3>电子门票</h3>
        </div>
        <div class="qr-container">
          <img src="../assets/code.png" class="qr-code" v-if="currentQRCode">
        </div>
        <div class="ticket-info">
          <p>请在景区入口处出示此二维码</p>
          <small>有效期至：2024-12-31</small>
        </div>
        <button class="btn btn-close" @click="qrDialogVisible = false">关闭</button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { orderManager } from '@/utils/orderManager'

export default {
  name: 'Orders',
  data() {
    return {
      orderStatus: 'all',
      orders: [],
      total: 0,
      pageSize: 5,
      currentPage: 1,
      qrDialogVisible: false,
      currentQRCode: '',
      statusTabs: [
        { label: '全部订单', value: 'all', count: 0 },
        { label: '待支付', value: 'pending', count: 0 },
        { label: '已支付', value: 'paid', count: 0 },
        { label: '已完成', value: 'completed', count: 0 },
        { label: '已取消', value: 'cancelled', count: 0 }
      ]
    }
  },
  computed: {
    totalPages() {
      return Math.ceil(this.total / this.pageSize)
    }
  },
  methods: {
    async handleStatusChange(status) {
      this.orderStatus = status
      this.currentPage = 1
      this.updateOrders()
    },

    async handlePageChange(page) {
      this.currentPage = page
      this.updateOrders()
    },

    async handlePay(orderId) {
      try {
        // 模拟支付过程
        await this.$confirm('确认支付该订单？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })

        // 生成二维码（实际项目中应该由后端生成）
        const qrCode = ``
        
        // 更新订单状态
        if (orderManager.updateOrderStatus(orderId, 'paid', qrCode)) {
          this.$message.success('支付成功！')
          this.updateOrders()
        } else {
          this.$message.error('订单状态更新失败')
        }
      } catch (error) {
        if (error !== 'cancel') {
          this.$message.error('支付失败，请稍后重试')
          console.error(error)
        }
      }
    },

    async handleCancel(orderId) {
      try {
        await this.$confirm('确定要取消该订单吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        
        const updatedOrder = orderManager.updateOrderStatus(orderId, 'cancelled')
        if (updatedOrder) {
          this.$message.success('订单已取消')
          await this.getOrders() // 刷新订单列表
        } else {
          this.$message.error('找不到该订单')
        }
      } catch (error) {
        if (error !== 'cancel') {
          this.$message.error('取消订单失败，请稍后重试')
          console.error(error)
        }
      }
    },

    showQRCode(order) {
      this.currentQRCode = order.qrCode
      this.qrDialogVisible = true
    },

    getStatusText(status) {
      const statusMap = {
        pending: '待支付',
        paid: '已支付',
        completed: '已完成',
        cancelled: '已取消'
      }
      return statusMap[status] || status
    },

    updateOrders() {
      // 获取所有订单
      const allOrders = orderManager.getOrders()
      
      // 根据状态筛选
      const filteredOrders = this.orderStatus === 'all' 
        ? allOrders 
        : allOrders.filter(order => order.status === this.orderStatus)
      
      // 按创建时间倒序排序
      filteredOrders.sort((a, b) => new Date(b.createTime) - new Date(a.createTime))
      
      // 分页处理
      const start = (this.currentPage - 1) * this.pageSize
      const end = start + this.pageSize
      
      this.orders = filteredOrders.slice(start, end)
      this.total = filteredOrders.length
      
      // 更新各状态的订单数量
      this.updateTabCounts()
    },

    async getOrders() {
      this.updateOrders()
    },

    // 检查是否有需要自动完成的订单
    checkOrdersCompletion() {
      const allOrders = orderManager.getOrders()
      const now = new Date()
      
      allOrders.forEach(order => {
        if (order.status === 'paid') {
          const visitDate = new Date(order.visitDate)
          if (visitDate < now) {
            orderManager.updateOrderStatus(order.orderId, 'completed')
          }
        }
      })
    },

    formatDate(date) {
      return new Date(date).toLocaleDateString('zh-CN')
    },

    formatDateTime(datetime) {
      return new Date(datetime).toLocaleString('zh-CN')
    },

    updateTabCounts() {
      const allOrders = orderManager.getOrders()
      this.statusTabs = this.statusTabs.map(tab => ({
        ...tab,
        count: tab.value === 'all' 
          ? allOrders.length 
          : allOrders.filter(o => o.status === tab.value).length
      }))
    }
  },
  created() {
    this.getOrders()
    this.checkOrdersCompletion()

    // 获取所有订单
    this.orders = orderManager.getOrders()
    
    // 如果有orderId参数，显示对应订单的支付弹窗
    const { orderId, status } = this.$route.query
    if (orderId && status === 'new') {
      const order = orderManager.getOrderById(orderId)
      if (order) {
        this.showPayDialog(order)
      }
    }

    // 滚动到指定订单
    if (orderId) {
      this.$nextTick(() => {
        const element = document.getElementById(orderId)
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' })
        }
      })
    }
  }
}
</script>

<style scoped>
/* 整体容器样式 */
.orders {
  padding: 40px;
  max-width: 1200px;
  margin: 0 auto;
  min-height: calc(100vh - 60px);
  background: url('@/assets/pattern-bg.png') repeat;
}

/* 页面标题样式 */
.page-header {
  margin-bottom: 40px;
  text-align: center;
  position: relative;
}

.page-header h1 {
  font-size: 36px;
  color: #8B4513;
  margin-bottom: 30px;
  font-weight: 600;
  position: relative;
  display: inline-block;
}

.page-header h1::before,
.page-header h1::after {
  content: '';
  position: absolute;
  top: 50%;
  width: 60px;
  height: 2px;
  background: linear-gradient(90deg, #8B4513 0%, rgba(139, 69, 19, 0.2) 100%);
}

.page-header h1::before {
  right: 100%;
  margin-right: 20px;
}

.page-header h1::after {
  left: 100%;
  margin-left: 20px;
}

/* 状态标签样式 */
.status-tabs {
  display: flex;
  justify-content: center;
  gap: 30px;
  border-bottom: none;
  padding-bottom: 20px;
  position: relative;
}

.status-tab {
  padding: 10px 24px;
  cursor: pointer;
  color: #6B7280;
  font-size: 16px;
  transition: all 0.3s;
  border-radius: 24px;
  background: rgba(255, 255, 255, 0.9);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.status-tab:hover {
  color: #8B4513;
  transform: translateY(-2px);
}

.status-tab.active {
  color: #fff;
  background: linear-gradient(135deg, #8B4513, #D2691E);
  font-weight: 500;
}

.count {
  background: #FF4D4F;
  color: white;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 12px;
  margin-left: 8px;
}

/* 订单卡片样式 */
.order-card {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  margin-bottom: 30px;
  overflow: hidden;
  transition: all 0.4s;
  border: 1px solid rgba(139, 69, 19, 0.1);
}

.order-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.12);
}

.order-header {
  background: linear-gradient(to right, #F8F4E9, #FDF6E3);
  padding: 20px 24px;
  border-bottom: 1px solid rgba(139, 69, 19, 0.1);
}

.order-number {
  color: #8B4513;
  font-size: 14px;
  font-family: 'STKaiti', 'KaiTi', serif;
}

.order-status {
  font-weight: 500;
  font-size: 14px;
  padding: 6px 16px;
  border-radius: 20px;
  position: relative;
}

.order-status::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 8px;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  transform: translateY(-50%);
}

.order-status.pending {
  background: #FFF7E6;
  color: #D48806;
  padding-left: 20px;
}

.order-status.pending::before {
  background: #D48806;
}

.order-status.paid {
  background: #E6F7FF;
  color: #1890FF;
  padding-left: 20px;
}

.order-status.paid::before {
  background: #1890FF;
}

.order-status.completed {
  background: #F6FFED;
  color: #52C41A;
  padding-left: 20px;
}

.order-status.completed::before {
  background: #52C41A;
}

.order-status.cancelled {
  background: #F5F5F5;
  color: #8C8C8C;
  padding-left: 20px;
}

.order-status.cancelled::before {
  background: #8C8C8C;
}

/* 订单内容样式 */
.order-content {
  padding: 30px;
  display: grid;
  grid-template-columns: 220px 1fr 250px;
  gap: 30px;
  align-items: center;
  background: linear-gradient(135deg, rgba(255,255,255,0.95), rgba(255,255,255,0.98));
}

.spot-image {
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.spot-image img {
  width: 100%;
  height: 160px;
  object-fit: cover;
  transition: transform 0.6s;
}

.spot-image:hover img {
  transform: scale(1.05);
}

.spot-tag {
  position: absolute;
  top: 12px;
  left: 12px;
  background: rgba(139, 69, 19, 0.8);
  color: white;
  padding: 6px 12px;
  border-radius: 4px;
  font-size: 12px;
  backdrop-filter: blur(4px);
}

.spot-name {
  font-size: 22px;
  color: #8B4513;
  margin: 0 0 20px 0;
  font-family: 'STXihei', 'Microsoft YaHei', sans-serif;
}

.visit-info {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #666;
  font-size: 15px;
}

.info-item i {
  color: #8B4513;
  font-size: 18px;
}

/* 价格和按钮样式 */
.price-box {
  text-align: right;
  margin-bottom: 25px;
  padding: 15px;
  background: #FFF9F0;
  border-radius: 12px;
}

.price-box small {
  color: #8B4513;
  display: block;
  margin-bottom: 8px;
}

.total-price {
  color: #FF4D4F;
  font-size: 28px;
  font-weight: 600;
  font-family: 'DIN Alternate', sans-serif;
}

.currency {
  font-size: 18px;
  margin-right: 4px;
}

.btn {
  padding: 12px 24px;
  border-radius: 25px;
  border: none;
  cursor: pointer;
  font-size: 15px;
  font-weight: 500;
  transition: all 0.3s;
  position: relative;
  overflow: hidden;
}

.btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(45deg, rgba(255,255,255,0.1), rgba(255,255,255,0));
  transform: translateX(-100%);
  transition: transform 0.6s;
}

.btn:hover::before {
  transform: translateX(100%);
}

.btn-primary {
  background: linear-gradient(135deg, #8B4513, #D2691E);
  color: white;
  box-shadow: 0 4px 15px rgba(139, 69, 19, 0.3);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(139, 69, 19, 0.4);
}

.btn-cancel {
  background: #F5F5F5;
  color: #666;
}

.btn-cancel:hover {
  background: #E8E8E8;
}

.btn-qr {
  background: linear-gradient(135deg, #52C41A, #389E0D);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  box-shadow: 0 4px 15px rgba(82, 196, 26, 0.3);
}

.btn-qr:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(82, 196, 26, 0.4);
}

/* 订单底部样式 */
.order-footer {
  padding: 16px 24px;
  background: #FDF6E3;
  border-top: 1px solid rgba(139, 69, 19, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #8B4513;
  font-size: 14px;
}

.create-time, .reminder {
  display: flex;
  align-items: center;
  gap: 8px;
}

.reminder {
  color: #D48806;
}

/* 空状态样式 */
.empty-state {
  text-align: center;
  padding: 80px 0;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

/* 分页样式 */
.custom-pagination {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 50px;
}

.page-number {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.3s;
  color: #8B4513;
  background: rgba(255, 255, 255, 0.9);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.page-number:hover {
  background: #FFF7E6;
  transform: translateY(-2px);
}

.page-number.active {
  background: linear-gradient(135deg, #8B4513, #D2691E);
  color: white;
  box-shadow: 0 4px 12px rgba(139, 69, 19, 0.3);
}

/* 门票弹窗样式 */
.ticket-dialog {
  border-radius: 20px;
  overflow: hidden;
}

.ticket-card {
  text-align: center;
  padding: 30px;
}

.ticket-header {
  margin-bottom: 24px;
}

.ticket-header .logo {
  width: 60px;
  margin-bottom: 12px;
}

.ticket-header h3 {
  color: #1F2937;
  margin: 0;
}

.qr-container {
  background: #F3F4F6;
  padding: 20px;
  border-radius: 12px;
  margin-bottom: 24px;
}

.qr-code {
  width: 200px;
  height: 200px;
}

.ticket-info {
  margin-bottom: 24px;
}

.ticket-info p {
  color: #4B5563;
  margin: 0 0 8px 0;
}

.ticket-info small {
  color: #6B7280;
}

.btn-close {
  width: 100%;
  background: #EF4444;
  color: white;
}

.btn-close:hover {
  background: #DC2626;
}
</style> 