export const favoriteManager = {
  // 获取所有收藏
  getFavorites() {
    return JSON.parse(localStorage.getItem('favorites') || '[]')
  },

  // 添加收藏
  addFavorite(spot) {
    const favorites = this.getFavorites()
    const newFavorite = {
      id: spot.id,
      name: spot.name,
      imageUrl: spot.imageUrl,
      description: spot.description,
      price: spot.price,
      tags: spot.tags,
      rating: spot.rating,
      addTime: new Date().toISOString()
    }
    
    // 检查是否已经收藏
    if (!favorites.some(f => f.id === spot.id)) {
      favorites.push(newFavorite)
      localStorage.setItem('favorites', JSON.stringify(favorites))
      return true
    }
    return false
  },

  // 移除收藏
  removeFavorite(spotId) {
    const favorites = this.getFavorites()
    const newFavorites = favorites.filter(f => f.id !== spotId)
    localStorage.setItem('favorites', JSON.stringify(newFavorites))
    return true
  },

  // 检查是否已收藏
  isFavorite(spotId) {
    const favorites = this.getFavorites()
    return favorites.some(f => f.id === spotId)
  }
} 