const ORDERS_KEY = 'tourism_orders'

export const orderManager = {
  // 生成订单号
  generateOrderId() {
    return 'ORDER' + Date.now() + Math.floor(Math.random() * 1000)
  },

  // 获取所有订单
  getOrders() {
    return JSON.parse(localStorage.getItem('orders') || '[]')
  },

  // 添加订单
  addOrder(orderData) {
    // 生成订单ID
    const orderId = Date.now().toString()
    
    // 创建新订单
    const order = {
      orderId,
      ...orderData,
      status: 'pending', // pending, paid, completed, cancelled
      createTime: new Date().toISOString(),
      qrCode: null
    }

    // 获取现有订单
    const orders = JSON.parse(localStorage.getItem('orders') || '[]')
    
    // 添加新订单
    orders.push(order)
    
    // 保存到localStorage
    localStorage.setItem('orders', JSON.stringify(orders))
    
    return order
  },

  // 更新订单状态
  updateOrderStatus(orderId, status, qrCode = null) {
    const orders = this.getOrders()
    const orderIndex = orders.findIndex(order => order.orderId === orderId)
    
    if (orderIndex !== -1) {
      orders[orderIndex].status = status
      if (status === 'paid') {
        orders[orderIndex].qrCode = qrCode || this.generateQRCode()
      }
      localStorage.setItem('orders', JSON.stringify(orders))
      return orders[orderIndex]
    }
    return false
  },

  // 获取指定状态的订单
  getOrdersByStatus(status) {
    const orders = this.getOrders()
    return status === 'all' ? orders : orders.filter(o => o.status === status)
  },

  // 获取单个订单详情
  getOrderById(orderId) {
    const orders = this.getOrders()
    return orders.find(order => order.orderId === orderId)
  },

  // 删除订单
  deleteOrder(orderId) {
    const orders = this.getOrders()
    const newOrders = orders.filter(o => o.orderId !== orderId)
    localStorage.setItem('orders', JSON.stringify(newOrders))
  },

  generateQRCode() {
    // 模拟生成二维码，实际项目中应该使用真实的二维码生成库
    return `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==`
  }
} 