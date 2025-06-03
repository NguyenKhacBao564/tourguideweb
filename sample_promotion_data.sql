-- Sample promotion data for testing
INSERT INTO Promotion (promo_id, code, description, discount_percentage, start_date, end_date, max_use, status) VALUES
('PROMO001', 'WELCOME10', 'Giảm giá 10% cho khách hàng mới', 10.00, '2024-01-01', '2024-12-31', 100, 'active'),
('PROMO002', 'SUMMER20', 'Giảm giá 20% cho tour mùa hè', 20.00, '2024-06-01', '2024-08-31', 50, 'active'),
('PROMO003', 'STUDENT15', 'Giảm giá 15% cho sinh viên', 15.00, '2024-01-01', '2024-12-31', 200, 'active'),
('PROMO004', 'FAMILY25', 'Giảm giá 25% cho gia đình (từ 4 người)', 25.00, '2024-01-01', '2024-12-31', 30, 'active'),
('PROMO005', 'NEWYEAR30', 'Giảm giá 30% đón năm mới', 30.00, '2024-12-15', '2025-01-15', 20, 'active'); 