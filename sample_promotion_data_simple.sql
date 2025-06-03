-- Dữ liệu mẫu cho bảng Promotion
-- Test data for promotion feature

INSERT INTO Promotion (promo_id, description, code, discount_percentage, start_date, end_date, max_use, status) VALUES
('PROMO001', 'Khuyến mãi chào mừng khách hàng mới', 'WELCOME10', 10.00, '2024-01-01', '2024-12-31', 100, 'active'),
('PROMO002', 'Giảm giá mùa hè sôi động', 'SUMMER20', 20.00, '2024-06-01', '2024-08-31', 50, 'active'),
('PROMO003', 'Ưu đãi cuối tuần đặc biệt', 'WEEKEND15', 15.00, '2024-01-01', '2024-12-31', 200, 'active'),
('PROMO004', 'Khuyến mãi nhóm từ 5 người', 'GROUP25', 25.00, '2024-01-01', '2024-12-31', 30, 'active'),
('PROMO005', 'Giảm giá sinh nhật công ty', 'BIRTHDAY30', 30.00, '2024-03-01', '2024-03-31', 20, 'expired');

SELECT * FROM Promotion; 