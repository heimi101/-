<template>
  <div class="detail">
    <el-card class="detail-card">
      <!-- 景点基本信息 -->
      <div class="spot-header">
        <h1>{{ spotInfo.name }}</h1>
        <el-button 
          type="danger" 
          icon="el-icon-star-off"
          @click="toggleFavorite"
          :class="{ 'is-favorite': isFavorite }">
          {{ isFavorite ? '已收藏' : '收藏' }}
        </el-button>
      </div>

      <!-- 图片展示 -->
      <div class="main-image">
        <img :src="spotInfo.imageUrl" :alt="spotInfo.name">
      </div>

      <!-- 景点详情 -->
      <div class="spot-info">
        <el-descriptions title="景点信息" :column="2" border>
          <el-descriptions-item label="开放时间">
            {{ spotInfo.openTime }}
          </el-descriptions-item>
          <el-descriptions-item label="门票价格">
            ¥{{ spotInfo.price }}
          </el-descriptions-item>
          <el-descriptions-item label="地址">
            {{ spotInfo.address }}
          </el-descriptions-item>
          <el-descriptions-item label="联系电话">
            {{ spotInfo.phone }}
          </el-descriptions-item>
        </el-descriptions>

        <div class="description">
          <h3>景点介绍</h3>
          <p>{{ spotInfo.description }}</p>
        </div>

        <!-- 设施列表 -->
        <div class="facilities">
          <h3>景区设施</h3>
          <div class="facility-list">
            <div v-for="facility in spotInfo.facilities" :key="facility.name" class="facility-item">
              <i :class="facility.icon"></i>
              <span>{{ facility.name }}</span>
            </div>
          </div>
        </div>

        <!-- 游玩贴士 -->
        <div class="tips">
          <h3>游玩贴士</h3>
          <ul>
            <li v-for="(tip, index) in spotInfo.tips" :key="index">{{ tip }}</li>
          </ul>
        </div>

        <!-- 购票按钮 -->
        <div class="booking-section">
          <el-button type="primary" size="large" @click="goToTicket">
            立即购票
          </el-button>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
import { favoriteManager } from '@/utils/favoriteManager'

export default {
  name: 'Detail',
  data() {
    return {
      spotInfo: {
        id: null,
        name: '',
        imageUrl: '',
        description: '',
        address: '',
        price: 0,
        openTime: '',
        phone: '',
        facilities: [],
        tips: []
      },
      isFavorite: false
    }
  },
  methods: {
    async toggleFavorite() {
      if (!this.checkLogin()) return
      
      try {
        if (this.isFavorite) {
          favoriteManager.removeFavorite(this.spotInfo.id)
          this.isFavorite = false
          this.$message.success('已取消收藏')
        } else {
          favoriteManager.addFavorite(this.spotInfo)
          this.isFavorite = true
          this.$message.success('收藏成功')
        }
      } catch (error) {
        this.$message.error('操作失败，请稍后重试')
        console.error(error)
      }
    },
    goToTicket() {
      if (!this.checkLogin()) return
      
      this.$router.push({
        path: '/ticket',
        query: { 
          id: this.spotInfo.id,
          name: this.spotInfo.name,
          price: this.spotInfo.price
        }
      })
    },
    checkLogin() {
      const isLoggedIn = localStorage.getItem('token')
      if (!isLoggedIn) {
        this.$message.warning('请先登录')
        this.$root.$emit('show-login')
        return false
      }
      return true
    },
    async getSpotInfo() {
      try {
        const id = parseInt(this.$route.params.id)
        if (!id) {
          throw new Error('Invalid ID')
        }

        // 景点详情数据
        const spotDetails = {
          1: {
            id: 1,
            name: '长隆野生动物世界',
            imageUrl: require('@/assets/spot1.jpg'),
            description: '亚洲最大的野生动物主题公园，园区内饲养了超过20000只珍稀动物。这里不仅可以观赏到大熊猫、白虎、考拉等珍稀动物，还有精彩的动物表演和互动体验。',
            address: '广州市番禺区长隆旅游度假区',
            price: 299,
            openTime: '09:00-18:00',
            phone: '020-12345678',
            facilities: [
              { icon: 'el-icon-food', name: '餐饮服务' },
              { icon: 'el-icon-toilet', name: '卫生间' },
              { icon: 'el-icon-parking', name: '停车场' },
              { icon: 'el-icon-first-aid-kit', name: '医务室' }
            ],
            tips: [
              '建议游玩时间：1天',
              '提前在网上预订门票可享受优惠',
              '园区内设有观光车，可以节省步行时间',
              '建议携带防晒用品和饮用水'
            ]
          },
          2: {
            id: 2,
            name: '深圳世界之窗',
            imageUrl: require('@/assets/spot2.jpg'),
            description: '深圳世界之窗是中国著名的缩微景区，位于深圳市南山区华侨城，是一座以世界各民族文化风情为主题的大型文化旅游景区。',
            address: '深圳市南山区华侨城',
            price: 220,
            openTime: '09:00-22:00',
            phone: '0755-86633333',
            facilities: [
              { icon: 'el-icon-food', name: '餐饮服务' },
              { icon: 'el-icon-toilet', name: '卫生间' },
              { icon: 'el-icon-parking', name: '停车场' },
              { icon: 'el-icon-first-aid-kit', name: '医务室' }
            ],
            tips: [
              '建议游玩时间：1天',
              '提前在网上预订门票可享受优惠',
              '园区内设有观光车，可以节省步行时间',
              '建议携带防晒用品和饮用水'
            ]
          },
          3: {
            id: 3,
            name: '珠海海洋王国',
            imageUrl: require('@/assets/spot3.jpg'),
            description: '珠海长隆海洋王国是一个大型海洋主题公园，位于珠海横琴长隆国际海洋度假区，是中国最大的海洋主题公园之一。',
            address: '珠海市横琴新区',
            price: 350,
            openTime: '10:00-19:00',
            phone: '0756-8888888',
            facilities: [
              { icon: 'el-icon-food', name: '餐饮服务' },
              { icon: 'el-icon-toilet', name: '卫生间' },
              { icon: 'el-icon-parking', name: '停车场' },
              { icon: 'el-icon-first-aid-kit', name: '医务室' }
            ],
            tips: [
              '建议游玩时间：1天',
              '提前在网上预订门票可享受优惠',
              '园区内设有观光车，可以节省步行时间',
              '建议携带防晒用品和饮用水'
            ]
          }
        }

        // 检查景点是否存在
        const spotDetail = spotDetails[id]
        if (!spotDetail) {
          throw new Error('Spot not found')
        }

        // 确保所有必需的字段都存在
        const requiredFields = ['id', 'name', 'imageUrl', 'description', 'address', 'price', 'openTime', 'phone', 'facilities', 'tips']
        const missingFields = requiredFields.filter(field => !spotDetail[field])
        
        if (missingFields.length > 0) {
          console.error('Missing required fields:', missingFields)
          throw new Error('Incomplete spot data')
        }

        // 更新组件数据
        this.spotInfo = { ...spotDetail }
        this.isFavorite = favoriteManager.isFavorite(id)

      } catch (error) {
        console.error('Error in getSpotInfo:', error)
        
        let errorMessage = '获取景点信息失败'
        if (error.message === 'Invalid ID') {
          errorMessage = '无效的景点ID'
        } else if (error.message === 'Spot not found') {
          errorMessage = '未找到该景点'
        } else if (error.message === 'Incomplete spot data') {
          errorMessage = '景点数据不完整'
        }
        
        this.$message.error(errorMessage)
        this.$router.push('/search')
      }
    }
  },
  created() {
    this.getSpotInfo()
  }
}
</script>

<style scoped>
.detail {
  padding: 20px;
}

.detail-card {
  margin: 0 auto;
  max-width: 1200px;
}

.spot-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.main-image {
  width: 100%;
  height: 400px;
  overflow: hidden;
  border-radius: 8px;
  margin-bottom: 30px;
}

.main-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.spot-info {
  margin-top: 30px;
}

.description {
  margin: 30px 0;
}

.facilities {
  margin: 30px 0;
}

.facility-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.facility-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 15px;
  background: #f5f7fa;
  border-radius: 8px;
}

.facility-item i {
  font-size: 24px;
  color: #409EFF;
}

.tips {
  margin: 30px 0;
}

.tips ul {
  list-style: none;
  padding: 0;
  margin-top: 20px;
}

.tips li {
  padding: 10px 0;
  padding-left: 24px;
  position: relative;
}

.tips li::before {
  content: '•';
  position: absolute;
  left: 0;
  color: #409EFF;
  font-size: 20px;
}

.booking-section {
  text-align: center;
  margin: 40px 0;
}

.is-favorite {
  background-color: #909399;
  border-color: #909399;
}
</style> 