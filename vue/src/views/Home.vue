<template>
  <div class="home">
    <!-- 使用轮播图组件 -->
    <hero-slider :banners="banners" />

    <!-- 搜索框改为中国传统纹样背景 -->
    <div class="search-container">
      <div class="search-box chinese-pattern"  >
        <div class="search-input">
          <i class="el-icon-search"></i>
          <input type="text" placeholder="搜索目的地、景点、主题...">
        </div>
        <button class="search-btn">寻美广东</button>
      </div>
    </div>

    <!-- 添加特色分类导航 -->
    <div class="quick-nav">
      <div class="nav-item">
        <div class="nav-icon">
          <i class="el-icon-picture"></i>
        </div>
        <span>名胜古迹</span>
      </div>
      <div class="nav-item">
        <div class="nav-icon">
          <i class="el-icon-sugar"></i>
        </div>
        <span>美食之旅</span>
      </div>
      <div class="nav-item">
        <div class="nav-icon">
          <i class="el-icon-house"></i>
        </div>
        <span>民俗体验</span>
      </div>
      <div class="nav-item">
        <div class="nav-icon">
          <i class="el-icon-sunny"></i>
        </div>
        <span>自然风光</span>
      </div>
    </div>

    <!-- 热门景点推荐改为网格布局 -->
    <section class="section popular-spots">
      <div class="section-header chinese-title">
        <div class="title-decoration left"></div>
        <h2>热门景点推荐</h2>
        <div class="title-decoration right"></div>
      </div>
      <div class="spots-grid">
        <div 
          v-for="spot in popularSpots" 
          :key="spot.id" 
          class="spot-card"
          @click="goToDetail(spot.id)">
          <div class="spot-image">
            <img :src="spot.imageUrl" :alt="spot.name">
            <div class="spot-price">¥{{ spot.price }}起</div>
          </div>
          <div class="spot-info">
            <h3>{{ spot.name }}</h3>
            <div class="spot-tags">
              <span v-for="tag in spot.tags" :key="tag" class="tag">{{ tag }}</span>
            </div>
            <p class="spot-desc">{{ spot.description }}</p>
            <div class="spot-footer">
              <div class="rating">
                <i class="el-icon-star-on"></i>
                <span>{{ spot.rating }}</span>
              </div>
              <button class="book-btn" @click.stop="goToTicket(spot.id)">立即预订</button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 添加城市特色展示 -->
    <section class="section city-features">
      <div class="feature-grid">
        <div class="feature-item large">
          <img :src="require('@/assets/guangzhou.jpg')" alt="广州">
          <div class="feature-content">
            <h3>广州</h3>
            <p>千年商都，岭南文化之都</p>
          </div>
        </div>
        <div class="feature-item">
          <img :src="require('@/assets/shenzhen.jpg')" alt="深圳">
          <div class="feature-content">
            <h3>深圳</h3>
            <p>现代都市魅力</p>
          </div>
        </div>
        <div class="feature-item">
          <img :src="require('@/assets/zhuhai.jpg')" alt="珠海">
          <div class="feature-content">
            <h3>珠海</h3>
            <p>浪漫海滨城市</p>
          </div>
        </div>
      </div>
    </section>

    <!-- 美食推荐改为横向滚动 -->
    <section class="section foods chinese-bg">
      <div class="section-header">
        <h2>粤式风味</h2>
        <div class="section-subtitle">CANTONESE CUISINE</div>
      </div>
      <div class="food-scroll">
        <div class="food-track">
          <div v-for="food in foods" :key="food.id" class="food-card">
            <div class="food-image">
              <img :src="food.imageUrl" :alt="food.name">
            </div>
            <div class="food-info">
              <h3>{{ food.name }}</h3>
              <p>{{ food.description }}</p>
              <div class="food-location">
                <i class="el-icon-location"></i>
                <span>{{ food.location }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 添加特色体验区域 -->
    <section class="section experiences">
      <div class="experience-container">
        <div class="experience-text">
          <h2>岭南文化体验</h2>
          <p>探索广东独特的文化魅力</p>
          <ul class="experience-list">
            <li>粤剧表演欣赏</li>
            <li>茶艺文化体验</li>
            <li>岭南建筑探索</li>
            <li>手工艺品制作</li>
          </ul>
          <button class="experience-btn">立即预约</button>
        </div>
        <div class="experience-image">
          <img :src="require('@/assets/culture.jpg')" alt="文化体验">
        </div>
      </div>
    </section>

    <!-- 旅游资讯 -->
    <section class="section news">
      <div class="section-header">
        <h2>旅游资讯</h2>
        <div class="section-subtitle">TRAVEL NEWS</div>
      </div>
      <div class="news-list">
        <div v-for="item in news" :key="item.id" class="news-item">
          <div class="news-meta">
            <span class="news-category">{{ item.category }}</span>
            <span class="news-date">{{ item.date }}</span>
          </div>
          <h3 class="news-title">{{ item.title }}</h3>
          <p class="news-summary">{{ item.summary }}</p>
          <div class="news-footer">
            <div class="news-stats">
              <span><i class="el-icon-view"></i> 2.5k</span>
              <span><i class="el-icon-chat-dot-round"></i> 125</span>
            </div>
            <a href="#" class="read-more">
              阅读更多
              <i class="el-icon-right"></i>
            </a>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import HeroSlider from '@/components/home/HeroSlider.vue'

export default {
  name: 'Home',
  components: {
    HeroSlider
  },
  data() {
    return {
      banners: [
        {
          id: 1,
          title: '广州长隆野生动物世界',
          description: '与珍稀动物亲密接触，探索野生动物的奇妙世界',
          tag: '主题乐园',
          price: 299,
          imageUrl: require('@/assets/banner1.jpg')
        },
        {
          id: 2,
          title: '深圳世界之窗',
          description: '环游世界从这里开始，体验各国文化与建筑',
          tag: '文化体验',
          price: 220,
          imageUrl: require('@/assets/banner2.jpg')
        },
        {
          id: 3,
          title: '珠海海洋王国',
          description: '探索神秘海洋世界，感受海洋生物的魅力',
          tag: '海洋主题',
          price: 350,
          imageUrl: require('@/assets/banner3.jpg')
        }
      ],
      popularSpots: [
        {
          id: 1,
          name: '长隆野生动物世界',
          imageUrl: require('@/assets/spot1.jpg'),
          description: '亚洲最大的野生动物主题公园，园区内饲养了超过20000只珍稀动物。这里不仅可以观赏到大熊猫、白虎、考拉等珍稀动物，还有精彩的动物表演和互动体验。',
          price: 299,
          tags: ['主题乐园', '亲子游', '动物园'],
          rating: 4.8,
          height: 350
        },
        {
          id: 2,
          name: '深圳世界之窗',
          imageUrl: require('@/assets/spot2.jpg'),
          description: '深圳世界之窗是中国著名的缩微景区，位于深圳市南山区华侨城，是一座以世界各民族文化风情为主题的大型文化旅游景区。在这里可以看到世界各地著名的建筑物和人文景观。',
          price: 220,
          tags: ['主题乐园', '文化体验', '建筑景观'],
          rating: 4.5,
          height: 350
        },
        {
          id: 3,
          name: '珠海海洋王国',
          imageUrl: require('@/assets/spot3.jpg'),
          description: '世界级的海洋主题公园，拥有多个吉尼斯世界纪录。这里有世界最大的水族馆、精彩的海洋动物表演，以及刺激的游乐设施。',
          price: 350,
          tags: ['主题乐园', '海洋馆', '亲子游'],
          rating: 4.9,
          height: 350
        }
      ],
      foods: [
        {
          id: 1,
          name: '广州早茶',
          imageUrl: require('@/assets/food1.jpg'),
          description: '正宗广式点心，百年茶楼',
          location: '广州荔湾老城区'
        },
        {
          id: 2,
          name: '潮州牛肉火锅',
          imageUrl: require('@/assets/food2.jpg'),
          description: '传统潮州美食，鲜美可口'
        },
        {
          id: 3,
          name: '顺德鱼生',
          imageUrl: require('@/assets/food3.jpg'),
          description: '顺德特色美食，新鲜美味'
        },
        {
          id: 4,
          name: '肠粉',
          imageUrl: require('@/assets/food4.jpg'),
          description: '广州特色小吃，滑嫩爽口'
        }
      ],
      news: [
        {
          id: 1,
          title: '2024广州樱花节盛大开幕',
          summary: '广州从化区第十二届樱花节将于3月举行，超过3000株樱花树竞相绽放，打造浪漫粤式赏樱胜地。活动期间还将举办传统文化表演和美食节等特色活动。',
          date: '2024-02-28',
          category: '节庆活动'
        },
        {
          id: 2,
          title: '深圳大鹏所城修缮工程完工',
          summary: '历时两年的深圳大鹏所城修缮工程正式完工，这座始建于明朝的古城焕发新生。游客可以通过数字导览系统，深入了解大鹏所城的历史文化。',
          date: '2024-02-25',
          category: '文化遗产'
        },
        {
          id: 3,
          title: '2024广东美食文化节即将启动',
          summary: '第八届广东美食文化节将在广州、深圳等城市联动举办，集中展示粤式早茶、潮州菜、客家菜等特色美食，让市民游客品味地道的岭南饮食文化。',
          date: '2024-02-20',
          category: '美食文化'
        },
        {
          id: 4,
          title: '韶关丹霞山新增观景平台',
          summary: '世界自然遗产丹霞山景区新增"云端观景平台"，游客可以在此俯瞰丹霞地貌的壮丽景色。同时推出夜间观光项目，打造沉浸式夜游体验。',
          date: '2024-02-15',
          category: '景区动态'
        }
      ]
    }
  },
  methods: {
    goToDetail(id) {
      const spot = this.popularSpots.find(s => s.id === id)
      if (spot) {
        this.$router.push(`/detail/${id}`)
      } else {
        this.$message.error('未找到景点信息')
      }
    },
    goToTicket(id) {
      // 先检查是否登录
      if (!this.checkLogin()) return
      
      // 获取景点信息
      const spot = this.popularSpots.find(s => s.id === id)
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
    checkLogin() {
      const isLoggedIn = localStorage.getItem('token')
      if (!isLoggedIn) {
        this.$message.warning('请先登录')
        this.$root.$emit('show-login')
        return false
      }
      return true
    },
    async fetchHomeData() {
      try {
        // 模拟API调用
        // const response = await axios.get('/api/home')
        // this.banners = response.data.banners
        // this.popularSpots = response.data.popularSpots
        // this.foods = response.data.foods
        
        // 实际项目中替换为真实API调用
        console.log('获取首页数据成功')
      } catch (error) {
        this.$message.error('获取数据失败，请稍后重试')
        console.error(error)
      }
    }
  },
  created() {
    this.fetchHomeData()
  }
}
</script>

<style scoped>
.home {
  min-height: 100vh;
}

/* 搜索框样式 */
.search-container {
  margin-top: -40px;
  padding: 0 10%;
  position: relative;
  z-index: 10;
}

.search-box {
  background: white;
  border-radius: 50px;
  padding: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  display: flex;
  gap: 20px;
  position: relative;
}

.search-input {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 0 20px;
  background: #F8F9FA;
  border-radius: 25px;
  position: relative;
  z-index: 2;
}

.search-input i {
  color: #8B4513;
  font-size: 20px;
}

.search-input input {
  border: none;
  background: none;
  padding: 15px 0;
  width: 100%;
  font-size: 16px;
  color: #333;
  position: relative;
  z-index: 2;
}

.search-input input::placeholder {
  color: #999;
}

.search-btn {
  padding: 0 40px;
  background: linear-gradient(135deg, #8B4513, #D2691E);
  color: white;
  border: none;
  border-radius: 25px;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s;
  position: relative;
  z-index: 2;
}

.search-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(139, 69, 19, 0.3);
}

/* 通用section样式 */
.section {
  padding: 80px 10%;
}

.section-header {
  text-align: center;
  margin-bottom: 50px;
}

.section-header h2 {
  font-size: 36px;
  color: #8B4513;
  margin-bottom: 10px;
  font-weight: 600;
}

.section-subtitle {
  color: #D2691E;
  font-size: 14px;
  letter-spacing: 2px;
}

/* 景点卡片样式 */
.spots-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 30px;
  margin-top: 30px;
}

.spot-card {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  height: 100%;
  display: flex;
  flex-direction: column;
  cursor: pointer;
}

.spot-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
}

.spot-image {
  position: relative;
  height: 200px;
  overflow: hidden;
}

.spot-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.spot-info {
  padding: 20px;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.spot-info h3 {
  margin: 0 0 12px;
  font-size: 18px;
  color: #333;
}

.spot-tags {
  margin-bottom: 12px;
}

.tag {
  display: inline-block;
  padding: 4px 8px;
  margin-right: 8px;
  margin-bottom: 8px;
  background: #f5f7fa;
  color: #666;
  border-radius: 4px;
  font-size: 12px;
}

.spot-desc {
  color: #666;
  font-size: 14px;
  line-height: 1.5;
  margin-bottom: 16px;
  flex: 1;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.spot-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
}

.rating {
  display: flex;
  align-items: center;
  color: #ff9900;
}

.rating i {
  margin-right: 4px;
}

.book-btn {
  padding: 6px 12px;
  background: #3B82F6;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;
}

.book-btn:hover {
  background: #2563EB;
}

/* 主题卡片样式 */
.themes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 30px;
}

.theme-card {
  background: white;
  padding: 30px;
  border-radius: 20px;
  text-align: center;
  transition: all 0.3s;
}

.theme-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.theme-icon {
  width: 80px;
  height: 80px;
  margin: 0 auto 20px;
  background: #FFF7E6;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.theme-icon i {
  font-size: 36px;
  color: #D48806;
}

/* 美食卡片样式 */
.food-card {
  background: white;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.food-image {
  height: 200px;
}

.food-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.food-info {
  padding: 20px;
}

.food-location {
  color: #666;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 5px;
}

/* 资讯卡片样式 */
.news-list {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 30px;
  padding: 20px 0;
}

.news-item {
  background: white;
  padding: 25px;
  border-radius: 15px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  transition: all 0.3s;
  border: 1px solid rgba(139, 69, 19, 0.1);
}

.news-item:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.news-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.news-category {
  background: #8B4513;
  color: white;
  padding: 4px 12px;
  border-radius: 15px;
  font-size: 13px;
}

.news-date {
  color: #6B7280;
  font-size: 14px;
}

.news-title {
  font-size: 18px;
  color: #1F2937;
  margin-bottom: 12px;
  font-weight: 600;
  line-height: 1.4;
}

.news-summary {
  color: #6B7280;
  font-size: 14px;
  line-height: 1.6;
  margin-bottom: 20px;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.news-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 15px;
  border-top: 1px solid #E5E7EB;
}

.news-stats {
  display: flex;
  gap: 15px;
  color: #6B7280;
  font-size: 13px;
}

.news-stats span {
  display: flex;
  align-items: center;
  gap: 4px;
}

.read-more {
  color: #8B4513;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 14px;
  font-weight: 500;
}

.read-more i {
  transition: transform 0.3s;
}

.read-more:hover i {
  transform: translateX(5px);
}

/* 响应式设计 */
@media (max-width: 992px) {
  .news-list {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .news-item {
    padding: 20px;
  }
  
  .news-title {
    font-size: 16px;
  }
  
  .news-summary {
    font-size: 13px;
    -webkit-line-clamp: 2;
  }
}

/* 添加新的样式 */
.chinese-pattern {
  background-image: url('~@/assets/pattern.png');
  background-size: 200px;
  background-repeat: repeat;
  position: relative;
}

.chinese-pattern::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.95);
  z-index: 1;
}

.chinese-title {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
}

.title-decoration {
  width: 60px;
  height: 2px;
  background: linear-gradient(90deg, transparent, #8B4513);
  position: relative;
}

.title-decoration::before {
  content: '';
  position: absolute;
  width: 10px;
  height: 10px;
  border: 2px solid #8B4513;
  border-radius: 50%;
  top: 50%;
  transform: translateY(-50%);
}

.title-decoration.left::before {
  right: 0;
}

.title-decoration.right::before {
  left: 0;
}

.quick-nav {
  display: flex;
  justify-content: space-around;
  padding: 40px 10%;
  background: #FFF9F0;
}

.nav-item {
  text-align: center;
  cursor: pointer;
  transition: all 0.3s;
}

.nav-icon {
  width: 80px;
  height: 80px;
  background: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 15px;
  box-shadow: 0 10px 20px rgba(139, 69, 19, 0.1);
  transition: all 0.3s;
}

.nav-icon i {
  font-size: 36px;
  color: #8B4513;
}

.nav-item:hover .nav-icon {
  transform: translateY(-5px) rotate(10deg);
  box-shadow: 0 15px 30px rgba(139, 69, 19, 0.2);
}

.city-features {
  background: #F8F4E9;
}

.feature-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: repeat(2, 250px);
  gap: 20px;
}

.feature-item {
  position: relative;
  overflow: hidden;
  border-radius: 20px;
}

.feature-item.large {
  grid-row: span 2;
}

.feature-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s;
}

.feature-content {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 20px;
  background: linear-gradient(transparent, rgba(0,0,0,0.8));
  color: white;
}

.feature-item:hover img {
  transform: scale(1.1);
}

.food-scroll {
  overflow-x: auto;
  padding: 20px 0;
}

.food-track {
  display: flex;
  gap: 20px;
  padding: 0 10%;
}

.chinese-bg {
  background: url('~@/assets/chinese-bg.png') no-repeat center;
  background-size: cover;
}

.experience-container {
  display: flex;
  align-items: center;
  gap: 50px;
  background: #FFF9F0;
  border-radius: 30px;
  padding: 50px;
}

.experience-text {
  flex: 1;
}

.experience-list {
  list-style: none;
  padding: 0;
  margin: 30px 0;
}

.experience-list li {
  margin: 15px 0;
  padding-left: 30px;
  position: relative;
}

.experience-list li::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  width: 20px;
  height: 2px;
  background: #8B4513;
}

.experience-image {
  flex: 1;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 20px 20px 60px rgba(0,0,0,0.1);
}

.experience-image img {
  width: 100%;
  height: 400px;
  object-fit: cover;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .spots-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .spots-grid {
    grid-template-columns: 1fr;
  }
  
  .feature-grid {
    grid-template-columns: 1fr;
  }
  
  .experience-container {
    flex-direction: column;
  }
}
</style> 