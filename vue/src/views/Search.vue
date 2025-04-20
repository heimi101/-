<template>
  <div class="search">
    <!-- 搜索框 -->
    <div class="search-header">
      <el-input
        v-model="searchQuery"
        placeholder="请输入景点名称"
        class="search-input"
        @keyup.enter.native="handleSearch">
        <el-button slot="append" icon="el-icon-search" @click="handleSearch"></el-button>
      </el-input>
      
      <!-- 筛选条件 -->
      <div class="filters">
        <el-select v-model="region" placeholder="地区" clearable>
          <el-option
            v-for="item in regions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        
        <el-select v-model="priceRange" placeholder="价格区间" clearable>
          <el-option
            v-for="item in priceRanges"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </div>
    </div>

    <!-- 搜索结果 -->
    <div class="search-results">
      <el-card v-for="spot in searchResults" :key="spot.id" class="spot-card">
        <div class="spot-content">
          <img :src="spot.imageUrl" class="spot-image" @click="goToDetail(spot.id)">
          <div class="spot-info">
            <div class="spot-header">
              <h3 class="clickable" @click="goToDetail(spot.id)">{{ spot.name }}</h3>
              <div class="rating">
                <el-rate
                  v-model="spot.rating"
                  disabled
                  show-score
                  text-color="#ff9900"
                  score-template="{value}">
                </el-rate>
              </div>
            </div>
            <div class="tags">
              <el-tag 
                v-for="tag in spot.tags" 
                :key="tag"
                size="small"
                effect="plain">
                {{ tag }}
              </el-tag>
            </div>
            <p class="description">{{ spot.description }}</p>
            <div class="spot-footer">
              <div class="price-info">
                <span class="price">¥{{ spot.price }}</span>
                <span class="price-label">起</span>
              </div>
              <div class="actions">
                <el-button 
                  type="text" 
                  icon="el-icon-star-off"
                  :class="{ 'is-favorite': spot.isFavorite }"
                  @click="toggleFavorite(spot)">
                  {{ spot.isFavorite ? '取消收藏' : '收藏' }}
                </el-button>
                <el-button 
                  type="primary" 
                  size="small"
                  @click="goToTicket(spot.id)">
                  立即预订
                </el-button>
              </div>
            </div>
          </div>
        </div>
      </el-card>
    </div>

    <!-- 分页 -->
    <div class="pagination">
      <el-pagination
        background
        layout="prev, pager, next"
        :total="total"
        :page-size="pageSize"
        @current-change="handlePageChange">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import { favoriteManager } from '@/utils/favoriteManager'

export default {
  name: 'Search',
  data() {
    return {
      searchQuery: '',
      region: '',
      priceRange: '',
      regions: [
        { value: 'guangzhou', label: '广州' },
        { value: 'shenzhen', label: '深圳' },
        { value: 'zhuhai', label: '珠海' },
        { value: 'foshan', label: '佛山' },
        { value: 'dongguan', label: '东莞' },
        { value: 'zhaoqing', label: '肇庆' },
        { value: 'huizhou', label: '惠州' },
        { value: 'jiangmen', label: '江门' },
        { value: 'shaoguan', label: '韶关' }
      ],
      priceRanges: [
        { value: '0-100', label: '100元以下' },
        { value: '100-200', label: '100-200元' },
        { value: '200-500', label: '200-500元' },
        { value: '500+', label: '500元以上' }
      ],
      searchResults: [
        {
          id: 1,
          name: '长隆野生动物世界',
          imageUrl: require('@/assets/spot1.jpg'),
          description: '亚洲最大的野生动物主题公园，超过20000只珍稀动物。这里不仅可以观赏到大熊猫、白虎、考拉等珍稀动物，还有精彩的动物表演和互动体验。',
          price: 299,
          region: 'guangzhou',
          tags: ['主题乐园', '亲子游', '动物园'],
          rating: 4.8,
          isFavorite: false
        },
        {
          id: 2,
          name: '深圳世界之窗',
          imageUrl: require('@/assets/spot2.jpg'),
          description: '在这里可以看到世界各地著名的建筑物和人文景观。园区分为世界广场、亚洲区、欧洲区、非洲区等多个主题区域。',
          price: 220,
          region: 'shenzhen',
          tags: ['主题乐园', '文化体验', '建筑景观'],
          rating: 4.5,
          isFavorite: false
        },
        {
          id: 3,
          name: '珠海海洋王国',
          imageUrl: require('@/assets/spot3.jpg'),
          description: '世界级的海洋主题公园，拥有多个吉尼斯世界纪录。这里有世界最大的水族馆、精彩的海洋动物表演，以及刺激的游乐设施。',
          price: 350,
          region: 'zhuhai',
          tags: ['主题乐园', '海洋馆', '亲子游'],
          rating: 4.9,
          isFavorite: false
        },
        {
          id: 4,
          name: '韶关丹霞山',
          imageUrl: require('@/assets/spot4.jpg'),
          description: '世界自然遗产，以其独特的丹霞地貌而闻名。这里的红色岩石造型奇特，景色壮观，是登山和摄影的绝佳去处。',
          price: 80,
          region: 'shaoguan',
          tags: ['自然风光', '地质公园', '登山'],
          rating: 4.7,
          isFavorite: false
        },
        {
          id: 5,
          name: '佛山祖庙',
          imageUrl: require('@/assets/spot5.jpg'),
          description: '广东四大名庙之一，始建于宋代。这里是岭南建筑艺术的典范，也是了解佛山武术文化的重要场所。',
          price: 45,
          region: 'foshan',
          tags: ['历史古迹', '文化遗产', '建筑艺术'],
          rating: 4.6,
          isFavorite: false
        },
        {
          id: 6,
          name: '惠州西湖',
          imageUrl: require('@/assets/spot6.jpg'),
          description: '惠州西湖是中国十大名胜西湖之一，以其优美的自然风光和深厚的文化底蕴而著名。湖区景色优美，亭台楼阁点缀其间。',
          price: 30,
          region: 'huizhou',
          tags: ['自然风光', '人文景观', '园林'],
          rating: 4.3,
          isFavorite: false
        },
        {
          id: 7,
          name: '东莞观音山',
          imageUrl: require('@/assets/spot7.jpg'),
          description: '观音山是国家森林公园，山顶有巨大的观音铜像。这里不仅可以登山健身，还能欣赏到整个东莞市的全景。',
          price: 60,
          region: 'dongguan',
          tags: ['自然风光', '登山', '宗教文化'],
          rating: 4.2,
          isFavorite: false
        },
        {
          id: 8,
          name: '肇庆七星岩',
          imageUrl: require('@/assets/spot8.jpg'),
          description: '七星岩以其独特的喀斯特地貌而闻名，七座山峰排列如北斗七星。景区内有山有水，洞穴众多，景色优美。',
          price: 70,
          region: 'zhaoqing',
          tags: ['自然风光', '地质公园', '山水景观'],
          rating: 4.5,
          isFavorite: false
        },
        {
          id: 9,
          name: '江门开平碉楼',
          imageUrl: require('@/assets/spot9.jpg'),
          description: '开平碉楼是世界文化遗产，融合了中西建筑特色。这些独特的建筑见证了华侨文化的发展历史。',
          price: 80,
          region: 'jiangmen',
          tags: ['文化遗产', '建筑景观', '历史古迹'],
          rating: 4.7,
          isFavorite: false
        }
      ],
      total: 9,
      pageSize: 10,
      currentPage: 1
    }
  },
  methods: {
    async handleSearch() {
      // 实现搜索逻辑
      const filteredResults = this.searchResults.filter(spot => {
        const matchQuery = !this.searchQuery || 
          spot.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          spot.description.toLowerCase().includes(this.searchQuery.toLowerCase())
        
        const matchRegion = !this.region || spot.region === this.region
        
        const matchPrice = !this.priceRange || this.checkPriceRange(spot.price, this.priceRange)
        
        return matchQuery && matchRegion && matchPrice
      })
      
      this.searchResults = filteredResults
      this.total = filteredResults.length
    },
    
    checkPriceRange(price, range) {
      switch(range) {
        case '0-100':
          return price <= 100
        case '100-200':
          return price > 100 && price <= 200
        case '200-500':
          return price > 200 && price <= 500
        case '500+':
          return price > 500
        default:
          return true
      }
    },
    
    handlePageChange(page) {
      this.currentPage = page
      this.handleSearch()
    },
    goToDetail(id) {
      this.$router.push(`/detail/${id}`)
    },
    goToTicket(id) {
      // 先检查是否登录
      if (!this.checkLogin()) return
      
      // 获取景点信息
      const spot = this.searchResults.find(s => s.id === id)
      if (!spot) {
        this.$message.error('未找到景点信息')
        return
      }
      
      // 跳转到购票页面并传递景点信息
      this.$router.push({
        path: '/ticket',
        query: { 
          id: spot.id,
          name: spot.name,
          price: spot.price
        }
      })
    },
    async toggleFavorite(spot) {
      if (!this.checkLogin()) return
      
      try {
        if (spot.isFavorite) {
          // 取消收藏
          favoriteManager.removeFavorite(spot.id)
          spot.isFavorite = false
          this.$message.success('已取消收藏')
        } else {
          // 添加收藏
          favoriteManager.addFavorite(spot)
          spot.isFavorite = true
          this.$message.success('收藏成功')
        }
      } catch (error) {
        this.$message.error('操作失败，请稍后重试')
        console.error(error)
      }
    },
    checkLogin() {
      const isLoggedIn = localStorage.getItem('token')
      if (!isLoggedIn) {
        this.$message.warning('请先登录')
        // 触发登录框显示
        this.$root.$emit('show-login')
        return false
      }
      return true
    }
  },
  created() {
    // 初始化收藏状态
    const favorites = favoriteManager.getFavorites()
    this.searchResults.forEach(spot => {
      spot.isFavorite = favorites.some(f => f.id === spot.id)
    })
  }
}
</script>

<style scoped>
.search {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.search-header {
  margin-bottom: 30px;
}

.search-input {
  width: 100%;
  margin-bottom: 20px;
}

.filters {
  display: flex;
  gap: 20px;
}

.spot-card {
  margin-bottom: 20px;
}

.spot-content {
  display: flex;
  gap: 20px;
}

.spot-image {
  width: 200px;
  height: 150px;
  object-fit: cover;
}

.spot-info {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.spot-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.rating {
  display: flex;
  align-items: center;
}

.tags {
  margin-bottom: 10px;
}

.el-tag {
  margin-right: 8px;
  margin-bottom: 8px;
}

.spot-footer {
  margin-top: auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.price-info {
  display: flex;
  align-items: baseline;
}

.price {
  font-size: 24px;
  font-weight: bold;
  color: #f56c6c;
}

.price-label {
  margin-left: 4px;
  color: #909399;
}

.is-favorite {
  color: #E6A23C;
}

.actions {
  display: flex;
  gap: 12px;
  align-items: center;
}

.pagination {
  text-align: center;
  margin-top: 30px;
}

.clickable {
  cursor: pointer;
}

.clickable:hover {
  color: var(--primary-color);
}
</style> 