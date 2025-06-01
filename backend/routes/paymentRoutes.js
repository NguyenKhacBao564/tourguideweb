const express = require('express');
const router = express.Router();
const PaymentService = require('../services/paymentService');

// Tạo URL thanh toán VNPay
router.post('/create-payment-url', async (req, res) => {
  try {
    const { bookingId, amount, customerInfo, tourInfo, bankCode, paymentMethod = 'VNPAY' } = req.body;
    
    // Validate input
    if (!bookingId || !amount || !customerInfo || !tourInfo) {
      return res.status(400).json({
        success: false,
        message: 'Thiếu thông tin bắt buộc'
      });
    }

    // Lấy IP address của client (ưu tiên IPv4)
    let ipAddr = req.headers['x-forwarded-for'] || 
                 req.connection.remoteAddress || 
                 req.socket.remoteAddress ||
                 (req.connection.socket ? req.connection.socket.remoteAddress : null) ||
                 '127.0.0.1';
    
    // Convert IPv6 localhost to IPv4
    if (ipAddr === '::1' || ipAddr === '::ffff:127.0.0.1') {
      ipAddr = '127.0.0.1';
    }
    
    // Extract IPv4 from IPv6 mapped address
    if (ipAddr.startsWith('::ffff:')) {
      ipAddr = ipAddr.substring(7);
    }

    console.log('Client IP Address:', ipAddr);

    const result = await PaymentService.createPaymentUrl({
      bookingId,
      amount,
      customerInfo,
      tourInfo,
      bankCode,
      phoneNumber: customerInfo.phone // Add phone number for MoMo
    }, ipAddr, paymentMethod);

    res.json(result);
  } catch (error) {
    console.error('Error creating payment URL:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Lỗi tạo URL thanh toán'
    });
  }
});

// Xử lý VNPay return URL (GET)
router.get('/vnpay-return', async (req, res) => {
  try {
    console.log('📝 VNPay return params received:', req.query);
    
    const result = await PaymentService.handleVNPayReturn(req.query);
    console.log('✅ VNPay return result:', result);
    
    // Redirect về frontend với kết quả
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    const redirectUrl = `${frontendUrl}/payment/result?success=${result.success}&message=${encodeURIComponent(result.message)}&orderId=${result.orderId || ''}`;
    
    console.log('🔄 Redirecting to:', redirectUrl);
    res.redirect(redirectUrl);
  } catch (error) {
    console.error('❌ Error handling VNPay return:', error);
    
    // Redirect về frontend với lỗi
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    const redirectUrl = `${frontendUrl}/payment/result?success=false&message=${encodeURIComponent(error.message || 'Lỗi xử lý kết quả thanh toán')}`;
    
    console.log('🔄 Error redirect to:', redirectUrl);
    res.redirect(redirectUrl);
  }
});

// Xử lý VNPay IPN (POST)
router.post('/vnpay-ipn', async (req, res) => {
  try {
    console.log('VNPay IPN params:', req.body);
    
    const result = await PaymentService.handleVNPayIPN(req.body);
    
    if (result.success) {
      res.json({ RspCode: '00', Message: 'success' });
    } else {
      res.json({ RspCode: '01', Message: result.message });
    }
  } catch (error) {
    console.error('Error handling VNPay IPN:', error);
    res.json({ RspCode: '99', Message: 'Unknow error' });
  }
});

// Lấy thông tin payment
router.get('/payment-info/:orderId', async (req, res) => {
  try {
    const { orderId } = req.params;
    
    if (!orderId) {
      return res.status(400).json({
        success: false,
        message: 'Thiếu mã đơn hàng'
      });
    }

    const result = await PaymentService.getPaymentInfo(orderId);
    res.json(result);
  } catch (error) {
    console.error('Error getting payment info:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Lỗi lấy thông tin thanh toán'
    });
  }
});

// Tạo thanh toán MoMo
router.post('/create-momo-payment', async (req, res) => {
  try {
    const { bookingId, amount, customerInfo, tourInfo, phoneNumber, tour_id, cus_id } = req.body;
    
    // Validate input
    if (!bookingId || !amount || !customerInfo || !tourInfo) {
      return res.status(400).json({
        success: false,
        message: 'Thiếu thông tin bắt buộc'
      });
    }

    // Validate tour_id và cus_id
    if (!tour_id || !cus_id) {
      return res.status(400).json({
        success: false,
        message: 'tour_id và cus_id là bắt buộc'
      });
    }

    if (!phoneNumber && !customerInfo.phone) {
      return res.status(400).json({
        success: false,
        message: 'Số điện thoại là bắt buộc cho thanh toán MoMo'
      });
    }

    const result = await PaymentService.createMoMoPayment({
      bookingId,
      amount,
      customerInfo,
      tourInfo,
      phoneNumber: phoneNumber || customerInfo.phone,
      tour_id,
      cus_id
    });

    res.json(result);
  } catch (error) {
    console.error('Error creating MoMo payment:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Lỗi tạo thanh toán MoMo'
    });
  }
});

// Tạo thanh toán chuyển khoản ngân hàng
router.post('/create-bank-transfer', async (req, res) => {
  try {
    const { bookingId, amount, customerInfo, tourInfo, bankInfo } = req.body;
    
    // Validate input
    if (!bookingId || !amount || !customerInfo || !tourInfo) {
      return res.status(400).json({
        success: false,
        message: 'Thiếu thông tin bắt buộc'
      });
    }

    const result = await PaymentService.createBankTransferPayment({
      bookingId,
      amount,
      customerInfo,
      tourInfo,
      bankInfo
    });

    res.json(result);
  } catch (error) {
    console.error('Error creating bank transfer payment:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Lỗi tạo thanh toán chuyển khoản'
    });
  }
});

// Lấy danh sách payments (cho admin)
router.get('/payments', async (req, res) => {
  try {
    const { page = 1, limit = 10, status, method } = req.query;
    
    const result = await PaymentService.getPayments({
      page: parseInt(page),
      limit: parseInt(limit),
      status,
      method
    });

    res.json(result);
  } catch (error) {
    console.error('Error getting payments:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Lỗi lấy danh sách thanh toán'
    });
  }
});

// Cập nhật trạng thái payment
router.put('/update-status/:paymentId', async (req, res) => {
  try {
    const { paymentId } = req.params;
    const { status, notes } = req.body;
    
    if (!paymentId || !status) {
      return res.status(400).json({
        success: false,
        message: 'Thiếu thông tin bắt buộc'
      });
    }

    const result = await PaymentService.updatePaymentStatus(paymentId, status, notes);
    res.json(result);
  } catch (error) {
    console.error('Error updating payment status:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Lỗi cập nhật trạng thái thanh toán'
    });
  }
});

// Thống kê thanh toán
router.get('/statistics', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    const result = await PaymentService.getPaymentStatistics({
      startDate,
      endDate
    });

    res.json(result);
  } catch (error) {
    console.error('Error getting payment statistics:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Lỗi lấy thống kê thanh toán'
    });
  }
});

// Test VNPay config
router.get('/test-config', async (req, res) => {
  try {
    const vnpayConfig = require('../config/vnpay');
    
    res.json({
      success: true,
      message: 'VNPay config loaded successfully',
      data: {
        vnp_TmnCode: vnpayConfig.vnp_TmnCode,
        vnp_Version: vnpayConfig.vnp_Version,
        vnp_Command: vnpayConfig.vnp_Command,
        vnp_CurrCode: vnpayConfig.vnp_CurrCode,
        vnp_Locale: vnpayConfig.vnp_Locale,
        vnp_ReturnUrl: vnpayConfig.vnp_ReturnUrl,
        vnp_IpnUrl: vnpayConfig.vnp_IpnUrl
      }
    });
  } catch (error) {
    console.error('Error testing VNPay config:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Lỗi kiểm tra cấu hình VNPay'
    });
  }
});

// Xử lý MoMo callback/return URL
router.get('/momo-return', async (req, res) => {
  try {
    console.log('MoMo return params:', req.query);
    
    const result = await PaymentService.handleMoMoCallback(req.query);
    
    // Redirect về frontend với kết quả
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    const redirectUrl = `${frontendUrl}/payment/result?success=${result.success}&message=${encodeURIComponent(result.message)}&orderId=${result.orderId || ''}`;
    
    res.redirect(redirectUrl);
  } catch (error) {
    console.error('Error handling MoMo return:', error);
    
    // Redirect về frontend với lỗi
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    const redirectUrl = `${frontendUrl}/payment/result?success=false&message=${encodeURIComponent(error.message || 'Lỗi xử lý kết quả thanh toán MoMo')}`;
    
    res.redirect(redirectUrl);
  }
});

// Xử lý MoMo IPN (POST)
router.post('/momo-ipn', async (req, res) => {
  try {
    console.log('MoMo IPN params:', req.body);
    
    const result = await PaymentService.handleMoMoCallback(req.body);
    
    if (result.success) {
      res.json({ resultCode: 0, message: 'success' });
    } else {
      res.json({ resultCode: 1, message: result.message });
    }
  } catch (error) {
    console.error('Error handling MoMo IPN:', error);
    res.json({ resultCode: 99, message: 'Unknown error' });
  }
});

// Test MoMo payment status
router.post('/test-momo-status', async (req, res) => {
  try {
    const { orderId, scenario = 'success' } = req.body;
    
    if (!orderId) {
      return res.status(400).json({
        success: false,
        message: 'Thiếu mã đơn hàng'
      });
    }

    const result = await PaymentService.testMoMoPaymentStatus(orderId, scenario);
    res.json(result);
  } catch (error) {
    console.error('Error testing MoMo payment status:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Lỗi test trạng thái thanh toán MoMo'
    });
  }
});

// Test MoMo config
router.get('/test-momo-config', async (req, res) => {
  try {
    const momoConfig = require('../config/momo');
    
    res.json({
      success: true,
      message: 'MoMo config loaded successfully',
      data: {
        environment: momoConfig.environment,
        baseUrl: momoConfig.baseUrl,
        currency: momoConfig.currency,
        targetEnvironment: momoConfig.targetEnvironment,
        returnUrl: momoConfig.returnUrl,
        ipnUrl: momoConfig.ipnUrl,
        testPhoneNumbers: momoConfig.testPhoneNumbers
      }
    });
  } catch (error) {
    console.error('Error testing MoMo config:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Lỗi kiểm tra cấu hình MoMo'
    });
  }
});

module.exports = router; 