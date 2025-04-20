<template>
  <div class="ticket">
    <el-card class="ticket-card">
      <!-- 景点基本信息 -->
      <div class="spot-info">
        <img :src="spotInfo.imageUrl" class="spot-image">
        <div class="info-content">
          <h2>{{ spotInfo.name }}</h2>
          <p>{{ spotInfo.address }}</p>
          <p class="price">¥{{ spotInfo.price }}起</p>
        </div>
      </div>

      <!-- 购票表单 -->
      <el-form ref="form" :model="form" :rules="rules" label-width="100px" class="ticket-form">
        <el-form-item label="游玩日期" prop="date">
          <el-date-picker
            v-model="form.date"
            type="date"
            placeholder="选择日期"
            :picker-options="pickerOptions">
          </el-date-picker>
        </el-form-item>

        <el-form-item label="票种" prop="ticketType">
          <el-radio-group v-model="form.ticketType">
            <el-radio v-for="ticket in ticketTypes" 
                     :key="ticket.id" 
                     :label="ticket.id">
              {{ ticket.name }} (¥{{ ticket.price }})
            </el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="数量" prop="quantity">
          <el-input-number 
            v-model="form.quantity" 
            :min="1" 
            :max="10">
          </el-input-number>
        </el-form-item>

        <el-form-item label="联系人" prop="contactName">
          <el-input v-model="form.contactName"></el-input>
        </el-form-item>

        <el-form-item label="手机号码" prop="phone">
          <el-input v-model="form.phone"></el-input>
        </el-form-item>

        <!-- 订单总价 -->
        <div class="order-total">
          <span>总价：</span>
          <span class="total-price">¥{{ totalPrice }}</span>
        </div>

        <el-form-item>
          <el-button type="primary" @click="submitOrder">提交订单</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { orderManager } from '@/utils/orderManager'

export default {
  name: 'Ticket',
  data() {
    return {
      spotInfo: {
        id: null,
        name: '',
        imageUrl: '',
        address: '',
        price: 0
      },
      ticketTypes: [
        { id: 1, name: '成人票', price: 0 },
        { id: 2, name: '儿童票', price: 0 },
        { id: 3, name: '老人票', price: 0 }
      ],
      form: {
        date: '',
        ticketType: '',
        quantity: 1,
        contactName: '',
        phone: '',
      },
      rules: {
        date: [{ required: true, message: '请选择游玩日期', trigger: 'change' }],
        ticketType: [{ required: true, message: '请选择票种', trigger: 'change' }],
        contactName: [
          { required: true, message: '请输入联系人姓名', trigger: 'blur' },
          { min: 2, message: '姓名长度不能小于2个字符', trigger: 'blur' }
        ],
        phone: [
          { required: true, message: '请输入手机号码', trigger: 'blur' },
          { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码', trigger: 'blur' }
        ]
      },
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7
        }
      }
    }
  },
  computed: {
    totalPrice() {
      const ticket = this.ticketTypes.find(t => t.id === this.form.ticketType)
      return ticket ? ticket.price * this.form.quantity : 0
    }
  },
  methods: {
    async submitOrder() {
      try {
        const valid = await this.$refs.form.validate()
        if (valid) {
          // 检查是否登录
          const token = localStorage.getItem('token')
          if (!token) {
            this.$message.warning('请先登录')
            this.$root.$emit('show-login')
            return
          }

          const orderData = {
            spotId: this.spotInfo.id,
            spotName: this.spotInfo.name,
            spotImage: this.spotInfo.imageUrl,
            visitDate: this.form.date,
            ticketType: this.getTicketTypeName(this.form.ticketType),
            quantity: this.form.quantity,
            totalPrice: this.totalPrice,
            contactName: this.form.contactName,
            phone: this.form.phone,
            userId: localStorage.getItem('userId') || 'anonymous'
          }

          // 使用orderManager添加订单
          const order = orderManager.addOrder(orderData)
          
          // 清空表单
          this.$refs.form.resetFields()
          
          this.$message.success('订单提交成功！')
          // 跳转到订单详情页
          this.$router.push({
            path: '/orders',
            query: { 
              orderId: order.orderId,
              status: 'new'  // 标记为新订单
            }
          })
        }
      } catch (error) {
        this.$message.error('提交订单失败，请稍后重试')
        console.error(error)
      }
    },
    getTicketTypeName(ticketTypeId) {
      const ticket = this.ticketTypes.find(t => t.id === ticketTypeId)
      return ticket ? ticket.name : ''
    },
    getSpotAddress(id) {
      // 根据景点ID返回对应地址
      const addresses = {
        1: '广州市番禺区长隆旅游度假区',
        2: '深圳市南山区深圳湾大道',
        3: '珠海市横琴新区环岛东路',
        4: '韶关市仁化县丹霞山景区',
        5: '佛山市禅城区祖庙路',
        6: '惠州市惠城区西湖路',
        7: '东莞市观音山国家森林公园',
        8: '肇庆市端州区七星岩景区',
        9: '江门市开平市自堂镇'
      }
      return addresses[id] || '地址信息未知'
    }
  },
  created() {
    // 从路由参数获取景点信息
    const { id, name, price } = this.$route.query
    console.log('Route query:', this.$route.query)
    
    if (!id || !name || !price) {
      console.error('Missing required parameters:', { id, name, price })
      this.$message.error('参数错误')
      this.$router.push('/search')
      return
    }
    
    try {
      // 设置景点信息
      this.spotInfo = {
        id: parseInt(id),
        name,
        imageUrl: require(`@/assets/spot${id}.jpg`),
        address: this.getSpotAddress(parseInt(id)),
        price: parseFloat(price)
      }

      // 更新票种价格
      this.ticketTypes = [
        { id: 1, name: '成人票', price: this.spotInfo.price },
        { id: 2, name: '儿童票', price: Math.floor(this.spotInfo.price * 0.5) },
        { id: 3, name: '老人票', price: Math.floor(this.spotInfo.price * 0.7) }
      ]
      console.log('Spot info:', this.spotInfo)
      console.log('Ticket types:', this.ticketTypes)
    } catch (error) {
      console.error('Error in created hook:', error)
      this.$message.error('加载景点信息失败')
      this.$router.push('/search')
    }
  }
}
</script>

<style scoped>
.ticket {
  padding: 20px;
}

.ticket-card {
  max-width: 800px;
  margin: 0 auto;
}

.spot-info {
  display: flex;
  gap: 20px;
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 1px solid #eee;
}

.spot-image {
  width: 200px;
  height: 150px;
  object-fit: cover;
}

.price {
  color: #f56c6c;
  font-size: 20px;
  font-weight: bold;
}

.ticket-form {
  margin-top: 30px;
}

.order-total {
  text-align: right;
  margin: 20px 0;
  font-size: 18px;
}

.total-price {
  color: #f56c6c;
  font-size: 24px;
  font-weight: bold;
}
</style> 