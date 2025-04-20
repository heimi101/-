<template>
  <div class="hero-slider">
    <swiper :options="swiperOption">
      <swiper-slide v-for="banner in banners" :key="banner.id">
        <div class="slide-content" :style="{ backgroundImage: `url(${banner.imageUrl})` }">
          <div class="slide-overlay"></div>
          <div class="slide-info">
            <div class="slide-tag">{{ banner.tag }}</div>
            <h2>{{ banner.title }}</h2>
            <p>{{ banner.description }}</p>
            <div class="slide-actions">
              <router-link :to="`/detail/${banner.id}`" class="explore-btn">
                立即探索
                <i class="el-icon-right"></i>
              </router-link>
              <router-link :to="`/ticket/${banner.id}`" class="book-btn">
                预订门票
                <span class="price">¥{{ banner.price }}起</span>
              </router-link>
            </div>
          </div>
        </div>
      </swiper-slide>
      <div class="swiper-pagination" slot="pagination"></div>
      <div class="swiper-button-prev" slot="button-prev"></div>
      <div class="swiper-button-next" slot="button-next"></div>
    </swiper>
  </div>
</template>

<script>
import { Swiper, SwiperSlide } from 'vue-awesome-swiper'
import 'swiper/css/swiper.css'

export default {
  name: 'HeroSlider',
  components: {
    Swiper,
    SwiperSlide
  },
  props: {
    banners: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      swiperOption: {
        loop: true,
        speed: 1000,
        autoplay: {
          delay: 5000,
          disableOnInteraction: false
        },
        pagination: {
          el: '.swiper-pagination',
          clickable: true,
          dynamicBullets: true
        },
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev'
        },
        effect: 'fade',
        fadeEffect: {
          crossFade: true
        }
      }
    }
  }
}
</script>

<style scoped>
/* 调整轮播图容器样式 */
.hero-slider {
  height: 65vh;
  min-height: 450px;
  max-height: 650px;
  margin-top: -60px;
  position: relative;
  overflow: hidden;
}

/* 确保 swiper 容器填满父元素 */
.hero-slider :deep(.swiper-container) {
  width: 100%;
  height: 100%;
}

/* 确保 swiper-slide 填满父元素 */
.hero-slider :deep(.swiper-slide) {
  width: 100%;
  height: 100%;
}

.slide-content {
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  position: relative;
  display: flex;
  align-items: center;
  padding: 0 8%;
}

.slide-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    to right,
    rgba(0, 0, 0, 0.75) 0%,
    rgba(0, 0, 0, 0.5) 50%,
    rgba(0, 0, 0, 0.2) 100%
  );
}

.slide-info {
  position: relative;
  color: white;
  max-width: 550px;
  padding: 30px 0;
}

.slide-tag {
  display: inline-block;
  padding: 6px 12px;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(8px);
  border-radius: 15px;
  font-size: 13px;
  margin-bottom: 12px;
  transform: translateY(20px);
  animation: fadeInUp 0.8s ease forwards;
  animation-delay: 0.2s;
  opacity: 0;
}

.slide-info h2 {
  font-size: 42px;
  margin-bottom: 12px;
  font-weight: 600;
  line-height: 1.2;
  transform: translateY(20px);
  animation: fadeInUp 0.8s ease forwards;
  animation-delay: 0.4s;
  opacity: 0;
}

.slide-info p {
  font-size: 15px;
  margin-bottom: 20px;
  line-height: 1.5;
  transform: translateY(20px);
  animation: fadeInUp 0.8s ease forwards;
  animation-delay: 0.6s;
  opacity: 0;
  opacity: 0.9;
}

.slide-actions {
  display: flex;
  gap: 15px;
  transform: translateY(20px);
  animation: fadeInUp 0.8s ease forwards;
  animation-delay: 0.8s;
  opacity: 0;
}

.explore-btn, .book-btn {
  display: inline-flex;
  align-items: center;
  padding: 10px 22px;
  border-radius: 22px;
  text-decoration: none;
  font-size: 14px;
  transition: all 0.3s;
}

.explore-btn {
  background: linear-gradient(135deg, #8B4513, #D2691E);
  color: white;
}

.book-btn {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.explore-btn i {
  margin-left: 8px;
  transition: transform 0.3s;
}

.explore-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(139, 69, 19, 0.3);
}

.explore-btn:hover i {
  transform: translateX(5px);
}

.book-btn:hover {
  background: rgba(255, 255, 255, 0.2);
}

.price {
  margin-left: 10px;
  font-weight: 600;
  color: #FFA500;
}

.swiper-button-prev,
.swiper-button-next {
  width: 40px;
  height: 40px;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(8px);
  border-radius: 50%;
  margin-top: -20px;
}

.swiper-button-prev:after,
.swiper-button-next:after {
  font-size: 18px;
  color: white;
}

.swiper-pagination {
  bottom: 15px !important;
}

.swiper-pagination-bullet {
  width: 8px;
  height: 8px;
  background: rgba(255, 255, 255, 0.5);
  opacity: 1;
}

.swiper-pagination-bullet-active {
  background: #FFA500;
  transform: scale(1.2);
}

@media (max-width: 992px) {
  .hero-slider {
    height: 60vh;
    min-height: 400px;
  }

  .slide-info h2 {
    font-size: 36px;
  }
}

@media (max-width: 768px) {
  .hero-slider {
    height: 55vh;
    min-height: 350px;
  }

  .slide-info {
    padding: 20px 0;
  }

  .slide-info h2 {
    font-size: 28px;
  }

  .slide-info p {
    font-size: 14px;
    margin-bottom: 15px;
  }

  .slide-actions {
    flex-direction: column;
    gap: 10px;
  }

  .explore-btn, .book-btn {
    width: 100%;
    justify-content: center;
    padding: 12px 20px;
  }
}
</style> 