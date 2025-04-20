<template>
  <div class="favorites">
    <div class="page-header">
      <h1>我的收藏</h1>
    </div>

    <div class="favorites-grid">
      <el-card v-for="spot in favorites" :key="spot.id" class="favorite-card">
        <img :src="spot.imageUrl" class="spot-image">
        <div class="spot-info">
          <h3>{{ spot.name }}</h3>
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
            <div class="price">¥{{ spot.price }}起</div>
            <div class="actions">
              <el-button 
                type="text" 
                @click="removeFavorite(spot.id)">
                取消收藏
              </el-button>
              <el-button 
                type="primary" 
                size="small"
                @click="goToTicket(spot)">
                立即预订
              </el-button>
            </div>
          </div>
        </div>
      </el-card>
    </div>

    <!-- 空状态 -->
    <div v-if="favorites.length === 0" class="empty-state">
      <el-empty description="暂无收藏">
        <router-link to="/search">
          <el-button type="primary">去发现景点</el-button>
        </router-link>
      </el-empty>
    </div>
  </div>
</template>

<script>
import { favoriteManager } from '@/utils/favoriteManager'

export default {
  name: 'Favorites',
  data() {
    return {
      favorites: []
    }
  },
  methods: {
    getFavorites() {
      this.favorites = favoriteManager.getFavorites()
    },
    removeFavorite(spotId) {
      this.$confirm('确定取消收藏该景点吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        favoriteManager.removeFavorite(spotId)
        this.getFavorites()
        this.$message.success('已取消收藏')
      }).catch(() => {})
    },
    goToTicket(spot) {
      this.$router.push({
        path: '/ticket',
        query: {
          id: spot.id,
          name: spot.name,
          price: spot.price
        }
      })
    }
  },
  created() {
    this.getFavorites()
  }
}
</script>

<style scoped>
.favorites {
  padding: 40px;
  max-width: 1200px;
  margin: 0 auto;
}

.page-header {
  margin-bottom: 30px;
  text-align: center;
}

.favorites-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 30px;
}

.favorite-card {
  transition: all 0.3s;
}

.favorite-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
}

.spot-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 8px;
  margin-bottom: 15px;
}

.spot-info h3 {
  margin: 0 0 10px 0;
  font-size: 18px;
}

.tags {
  margin-bottom: 10px;
}

.el-tag {
  margin-right: 8px;
  margin-bottom: 8px;
}

.description {
  color: #666;
  font-size: 14px;
  margin-bottom: 15px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.spot-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.price {
  color: #f56c6c;
  font-size: 20px;
  font-weight: bold;
}

.actions {
  display: flex;
  gap: 10px;
}

.empty-state {
  padding: 60px 0;
  text-align: center;
}
</style> 