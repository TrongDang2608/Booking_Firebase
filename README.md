# Website Đặt Lịch Hẹn (Booking System)

Hệ thống đặt lịch hẹn với Firebase Notifications, được xây dựng bằng Spring Boot và MySQL.

## 🚀 Tính năng chính

### Cho người dùng:
- ✅ Đăng ký thông tin cá nhân
- ✅ Xem danh sách dịch vụ có sẵn
- ✅ Chọn khung giờ phù hợp
- ✅ Đặt lịch hẹn trực tuyến
- ✅ Xem lịch sử đặt lịch
- ✅ Nhận thông báo xác nhận qua Firebase
- ✅ Nhận thông báo nhắc nhở trước buổi hẹn

### Cho quản trị viên:
- ✅ Dashboard tổng quan hệ thống
- ✅ Quản lý tất cả đặt lịch (xác nhận, hủy, dời lịch)
- ✅ Quản lý dịch vụ (thêm, sửa, xóa, tạm dừng)
- ✅ Quản lý khung giờ có sẵn
- ✅ Xem thống kê và báo cáo

### Firebase Notifications:
- ✅ Xác nhận lịch hẹn ngay sau khi đặt
- ✅ Nhắc nhở trước 24 giờ
- ✅ Nhắc nhở trước 1 giờ
- ✅ Thông báo khi hủy/dời lịch

## 🛠️ Công nghệ sử dụng

- **Backend**: Java Spring Boot 3.2.0
- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Database**: MySQL 8.0 (Aiven)
- **Notifications**: Firebase Cloud Messaging
- **Build Tool**: Maven
- **Template Engine**: Thymeleaf

## 📋 Yêu cầu hệ thống

- Java 17+
- Maven 3.6+
- MySQL 8.0+
- Firebase project với Cloud Messaging enabled


## 📱 Cách sử dụng

### Cho người dùng:
1. Truy cập `http://localhost:8080`
2. Đăng ký thông tin cá nhân
3. Chọn dịch vụ muốn đặt lịch
4. Chọn ngày và khung giờ phù hợp
5. Xác nhận đặt lịch
6. Nhận thông báo xác nhận qua browser

### Cho quản trị viên:
1. Truy cập `http://localhost:8080/admin`
2. Đăng nhập với:
   - Email: `admin@booking.com`
   - Password: `admin123`
3. Quản lý đặt lịch, dịch vụ, khung giờ

## 🔥 Firebase Notifications

### Các loại thông báo:

1. **Xác nhận lịch hẹn**: Gửi ngay sau khi đặt lịch thành công
2. **Nhắc nhở 24h**: Gửi trước 24 giờ buổi hẹn
3. **Nhắc nhở 1h**: Gửi trước 1 giờ buổi hẹn
4. **Hủy/Dời lịch**: Gửi khi admin thay đổi lịch hẹn

## 🗄️ Cấu trúc Database

### Bảng Users
- `id`: Primary key
- `full_name`: Họ và tên
- `email`: Email (unique)
- `phone_number`: Số điện thoại
- `fcm_token`: Firebase token
- `is_admin`: Quyền admin

### Bảng Services
- `id`: Primary key
- `name`: Tên dịch vụ
- `description`: Mô tả
- `price`: Giá dịch vụ
- `duration_minutes`: Thời gian (phút)
- `is_active`: Trạng thái hoạt động

### Bảng TimeSlots
- `id`: Primary key
- `date`: Ngày
- `start_time`: Giờ bắt đầu
- `end_time`: Giờ kết thúc
- `is_available`: Còn trống

### Bảng Bookings
- `id`: Primary key
- `user_id`: Foreign key to Users
- `service_id`: Foreign key to Services
- `time_slot_id`: Foreign key to TimeSlots
- `status`: Trạng thái (PENDING, CONFIRMED, CANCELLED, COMPLETED, RESCHEDULED)
- `notes`: Ghi chú
- `reminder_sent`: Đã gửi nhắc nhở
- `confirmation_sent`: Đã gửi xác nhận

## 🚀 API Endpoints

### Bookings
- `POST /api/bookings` - Tạo đặt lịch mới
- `GET /api/bookings/{id}` - Lấy thông tin đặt lịch
- `GET /api/bookings/user/{userId}` - Lấy đặt lịch của user
- `GET /api/bookings/date/{date}` - Lấy đặt lịch theo ngày
- `PUT /api/bookings/{id}/confirm` - Xác nhận đặt lịch
- `PUT /api/bookings/{id}/cancel` - Hủy đặt lịch
- `PUT /api/bookings/{id}/reschedule` - Dời lịch hẹn

### Services
- `GET /api/services` - Lấy tất cả dịch vụ
- `POST /api/services` - Tạo dịch vụ mới
- `PUT /api/services/{id}` - Cập nhật dịch vụ
- `PUT /api/services/{id}/activate` - Kích hoạt dịch vụ
- `PUT /api/services/{id}/deactivate` - Tạm dừng dịch vụ

### TimeSlots
- `GET /api/time-slots/available/{date}` - Lấy khung giờ trống theo ngày
- `POST /api/time-slots` - Tạo khung giờ mới
- `POST /api/time-slots/bulk` - Tạo nhiều khung giờ cùng lúc

### Users
- `POST /api/users` - Tạo user mới
- `GET /api/users/{id}` - Lấy thông tin user
- `PUT /api/users/{id}/fcm-token` - Cập nhật FCM token

