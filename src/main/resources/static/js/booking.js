// Global variables
let selectedService = null;
let selectedTimeSlot = null;
let currentUser = null;
let availableTimeSlots = [];

// Initialize the booking system
document.addEventListener('DOMContentLoaded', function() {
    initializeBookingSystem();
    loadServices();
    loadTimeSlots();
});

// Initialize booking system
function initializeBookingSystem() {
    // Load user info from localStorage and update UI
    const savedUser = localStorage.getItem('bookingUser');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        updateUserInfo();
        showUserNav();

        // [ĐÃ XÓA] Lời gọi hàm tự động đã được xóa khỏi đây
        // if (typeof requestPermissionAndSendToken === 'function') {
        //     requestPermissionAndSendToken();
        // }
    } else {
        showGuestNav();
    }
}

// Show guest navigation
function showGuestNav() {
    document.getElementById('guest-nav').style.display = 'block';
    document.getElementById('user-nav').style.display = 'none';
}

// Show user navigation
function showUserNav() {
    document.getElementById('guest-nav').style.display = 'none';
    document.getElementById('user-nav').style.display = 'block';
}

// Show login modal
function showLoginModal() {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.id = 'loginModal';
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close" onclick="closeModal('loginModal')">&times;</span>
            <h2>Đăng nhập</h2>
            <form id="loginForm">
                <div class="form-group">
                    <label for="loginEmail">Email *</label>
                    <input type="email" id="loginEmail" class="form-control" required>
                </div>
                <div class="form-group">
                    <label for="loginPassword">Mật khẩu *</label>
                    <input type="password" id="loginPassword" class="form-control" required>
                </div>
                <button type="submit" class="btn btn-primary">Đăng nhập</button>
                <p class="mt-3">Chưa có tài khoản? <a href="#" onclick="closeModal('loginModal'); showRegisterModal();">Đăng ký ngay</a></p>
            </form>
        </div>
    `;

    document.body.appendChild(modal);
    modal.style.display = 'block';

    document.getElementById('loginForm').addEventListener('submit', handleLogin);
}

// Show register modal
function showRegisterModal() {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.id = 'registerModal';
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close" onclick="closeModal('registerModal')">&times;</span>
            <h2>Đăng ký tài khoản</h2>
            <form id="registerForm">
                <div class="form-group">
                    <label for="fullName">Họ và tên *</label>
                    <input type="text" id="fullName" class="form-control" required>
                </div>
                <div class="form-group">
                    <label for="email">Email *</label>
                    <input type="email" id="email" class="form-control" required>
                </div>
                <div class="form-group">
                    <label for="password">Mật khẩu *</label>
                    <input type="password" id="password" class="form-control" required>
                </div>
                <div class="form-group">
                    <label for="phoneNumber">Số điện thoại *</label>
                    <input type="tel" id="phoneNumber" class="form-control" required>
                </div>
                <button type="submit" class="btn btn-primary">Đăng ký</button>
                <p class="mt-3">Đã có tài khoản? <a href="#" onclick="closeModal('registerModal'); showLoginModal();">Đăng nhập</a></p>
            </form>
        </div>
    `;

    document.body.appendChild(modal);
    modal.style.display = 'block';

    document.getElementById('registerForm').addEventListener('submit', handleRegistration);
}

// Show user registration modal
function showUserRegistrationModal() {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.id = 'userModal';
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close" onclick="closeModal('userModal')">&times;</span>
            <h2>Cập nhật thông tin</h2>
            <form id="userForm">
                <div class="form-group">
                    <label for="updateFullName">Họ và tên *</label>
                    <input type="text" id="updateFullName" class="form-control" required value="${currentUser.fullName}">
                </div>
                <div class="form-group">
                    <label for="updateEmail">Email *</label>
                    <input type="email" id="updateEmail" class="form-control" required value="${currentUser.email}" readonly>
                </div>
                <div class="form-group">
                    <label for="updatePhoneNumber">Số điện thoại *</label>
                    <input type="tel" id="updatePhoneNumber" class="form-control" required value="${currentUser.phoneNumber}">
                </div>
                <button type="submit" class="btn btn-primary">Cập nhật</button>
            </form>
        </div>
    `;

    document.body.appendChild(modal);
    modal.style.display = 'block';

    document.getElementById('userForm').addEventListener('submit', handleUserUpdate); // Sửa tên hàm
}


// === HÀM MỚI ĐỂ XỬ LÝ CẬP NHẬT USER ===
async function handleUserUpdate(e) {
    e.preventDefault();
    console.log("Updating user info...");
    // Đây là nơi bạn sẽ gọi API để cập nhật thông tin người dùng
    // Ví dụ:
    /*
    const updatedData = {
        fullName: document.getElementById('updateFullName').value,
        phoneNumber: document.getElementById('updatePhoneNumber').value
    };
    // const response = await fetch(`/api/users/${currentUser.id}`, { method: 'PUT', ... });
    */
    showAlert('Chức năng cập nhật đang được phát triển.', 'info');
    closeModal('userModal');
}


// Handle registration
async function handleRegistration(e) {
    e.preventDefault();

    const formData = {
        fullName: document.getElementById('fullName').value,
        email: document.getElementById('email').value,
        password: document.getElementById('password').value,
        phoneNumber: document.getElementById('phoneNumber').value
    };

    try {
        showLoading('Đang tạo tài khoản...');

        const response = await fetch('/api/users/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        if (response.ok) {
            currentUser = await response.json();
            localStorage.setItem('bookingUser', JSON.stringify(currentUser));
            updateUserInfo();
            closeModal('registerModal');
            showUserNav();
            hideLoading();
            showAlert('Đăng ký thành công!', 'success');

            // [ĐÃ XÓA] Lời gọi hàm tự động đã được xóa khỏi đây
            // if (typeof requestPermissionAndSendToken === 'function') {
            //     requestPermissionAndSendToken();
            // }

        } else {
            const error = await response.json();
            throw new Error(error.error || 'Có lỗi xảy ra');
        }
    } catch (error) {
        hideLoading();
        showAlert(error.message, 'danger');
    }
}

// Handle login
async function handleLogin(e) {
    e.preventDefault();

    const loginData = {
        email: document.getElementById('loginEmail').value,
        password: document.getElementById('loginPassword').value
    };

    try {
        showLoading('Đang đăng nhập...');

        const response = await fetch('/api/users/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(loginData)
        });

        if (response.ok) {
            currentUser = await response.json();
            localStorage.setItem('bookingUser', JSON.stringify(currentUser));
            updateUserInfo();
            closeModal('loginModal');
            showUserNav();
            hideLoading();
            showAlert('Đăng nhập thành công!', 'success');

            // [ĐÃ XÓA] Lời gọi hàm tự động đã được xóa khỏi đây
            // if (typeof requestPermissionAndSendToken === 'function') {
            //     requestPermissionAndSendToken();
            // }

        } else {
            const error = await response.json();
            throw new Error(error.error || 'Sai email hoặc mật khẩu');
        }
    } catch (error) {
        hideLoading();
        showAlert(error.message, 'danger');
    }
}

// ... (Các hàm còn lại giữ nguyên, không thay đổi) ...

// Update user info display
function updateUserInfo() {
    const userInfo = document.getElementById('userInfo');
    if (userInfo && currentUser) {
        userInfo.innerHTML = `
            <div class="card">
                <div class="card-header">Thông tin cá nhân</div>
                <div class="card-body">
                    <p><strong>Tên:</strong> ${currentUser.fullName}</p>
                    <p><strong>Email:</strong> ${currentUser.email}</p>
                    <p><strong>Số điện thoại:</strong> ${currentUser.phoneNumber}</p>
                </div>
            </div>
        `;
    }
}

// Load services
async function loadServices() {
    try {
        const response = await fetch('/api/services');
        if (response.ok) {
            const services = await response.json();
            displayServices(services);
        } else {
            throw new Error('Không thể tải danh sách dịch vụ');
        }
    } catch (error) {
        showAlert('Lỗi tải dịch vụ: ' + error.message, 'danger');
    }
}

// Display services
function displayServices(services) {
    const servicesContainer = document.getElementById('servicesContainer');
    if (!servicesContainer) return;

    servicesContainer.innerHTML = '';

    services.forEach(service => {
        const serviceCard = document.createElement('div');
        serviceCard.className = 'service-card';
        serviceCard.innerHTML = `
            <h3>${service.name}</h3>
            <div class="service-price">${formatPrice(service.price)} VNĐ</div>
            <div class="service-duration">Thời gian: ${service.durationMinutes} phút</div>
            <p>${service.description || ''}</p>
            <button class="btn btn-primary" onclick="selectService(${service.id}, '${service.name}', ${service.price}, ${service.durationMinutes})">
                Chọn dịch vụ
            </button>
        `;
        servicesContainer.appendChild(serviceCard);
    });
}

// Select service
function selectService(serviceId, serviceName, servicePrice, serviceDuration) {
    selectedService = {
        id: serviceId,
        name: serviceName,
        price: servicePrice,
        durationMinutes: serviceDuration
    };

    // Update UI
    document.querySelectorAll('.service-card').forEach(card => {
        card.style.borderColor = '#e1e5e9';
    });

    event.target.closest('.service-card').style.borderColor = '#667eea';

    // Show time selection
    showTimeSelection();
    showAlert(`Đã chọn dịch vụ: ${serviceName}`, 'success');
}

// Show time selection
function showTimeSelection() {
    const timeSelection = document.getElementById('timeSelection');
    if (timeSelection) {
        timeSelection.style.display = 'block';
        timeSelection.classList.add('fade-in');
    }

    // Load time slots for today and next 7 days
    loadTimeSlots();
}

// Load time slots
async function loadTimeSlots() {
    try {
        const today = new Date();
        const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);

        const response = await fetch(`/api/time-slots/available/date-range?startDate=${formatDate(today)}&endDate=${formatDate(nextWeek)}`);

        if (response.ok) {
            availableTimeSlots = await response.json();
            displayTimeSlots();
        } else {
            throw new Error('Không thể tải khung giờ');
        }
    } catch (error) {
        showAlert('Lỗi tải khung giờ: ' + error.message, 'danger');
    }
}

// Display time slots
function displayTimeSlots() {
    const timeSlotsContainer = document.getElementById('timeSlotsContainer');
    if (!timeSlotsContainer) return;

    timeSlotsContainer.innerHTML = '';

    // Group time slots by date
    const slotsByDate = {};
    availableTimeSlots.forEach(slot => {
        const date = slot.date;
        if (!slotsByDate[date]) {
            slotsByDate[date] = [];
        }
        slotsByDate[date].push(slot);
    });

    // Display time slots for each date
    Object.keys(slotsByDate).sort().forEach(date => {
        const dateContainer = document.createElement('div');
        dateContainer.className = 'date-container';
        dateContainer.innerHTML = `
            <h4>${formatDisplayDate(date)}</h4>
            <div class="time-slots" id="slots-${date}"></div>
        `;

        timeSlotsContainer.appendChild(dateContainer);

        const slotsContainer = document.getElementById(`slots-${date}`);
        slotsByDate[date].forEach(slot => {
            const timeSlotElement = document.createElement('div');
            timeSlotElement.className = 'time-slot';
            timeSlotElement.innerHTML = `
                <div>${formatTime(slot.startTime)}</div>
                <div>${formatTime(slot.endTime)}</div>
            `;
            timeSlotElement.onclick = () => selectTimeSlot(slot.id, slot.startTime, slot.endTime, date);
            slotsContainer.appendChild(timeSlotElement);
        });
    });
}

// Select time slot
function selectTimeSlot(timeSlotId, startTime, endTime, date) {
    selectedTimeSlot = {
        id: timeSlotId,
        startTime: startTime,
        endTime: endTime,
        date: date
    };

    // Update UI
    document.querySelectorAll('.time-slot').forEach(slot => {
        slot.classList.remove('selected');
    });

    event.target.classList.add('selected');

    // Show booking summary
    showBookingSummary();
    showAlert(`Đã chọn khung giờ: ${formatDisplayDate(date)} từ ${formatTime(startTime)} - ${formatTime(endTime)}`, 'success');
}

// Show booking summary
function showBookingSummary() {
    const bookingSummary = document.getElementById('bookingSummary');
    if (!bookingSummary || !selectedService || !selectedTimeSlot) return;

    bookingSummary.innerHTML = `
        <h3>Tóm tắt đặt lịch</h3>
        <div class="booking-summary">
            <div class="summary-row">
                <span class="summary-label">Dịch vụ:</span>
                <span class="summary-value">${selectedService.name}</span>
            </div>
            <div class="summary-row">
                <span class="summary-label">Ngày:</span>
                <span class="summary-value">${formatDisplayDate(selectedTimeSlot.date)}</span>
            </div>
            <div class="summary-row">
                <span class="summary-label">Thời gian:</span>
                <span class="summary-value">${formatTime(selectedTimeSlot.startTime)} - ${formatTime(selectedTimeSlot.endTime)}</span>
            </div>
            <div class="summary-row">
                <span class="summary-label">Giá:</span>
                <span class="summary-value">${formatPrice(selectedService.price)} VNĐ</span>
            </div>
        </div>
        <div class="form-group">
            <label for="notes">Ghi chú (tùy chọn)</label>
            <textarea id="notes" class="form-control" rows="3" placeholder="Nhập ghi chú nếu có..."></textarea>
        </div>
        <button class="btn btn-success btn-lg" onclick="submitBooking()">
            Xác nhận đặt lịch
        </button>
    `;

    bookingSummary.style.display = 'block';
    bookingSummary.classList.add('slide-up');
}

// Submit booking
async function submitBooking() {
    if (!selectedService || !selectedTimeSlot || !currentUser) {
        showAlert('Vui lòng đăng nhập và chọn đầy đủ thông tin', 'warning');
        return;
    }

    const bookingData = {
        userId: currentUser.id,
        serviceId: selectedService.id,
        timeSlotId: selectedTimeSlot.id,
        notes: document.getElementById('notes').value || ''
    };

    try {
        showLoading('Đang xử lý đặt lịch...');

        const response = await fetch('/api/bookings', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(bookingData)
        });

        if (response.ok) {
            const booking = await response.json();
            hideLoading();
            showBookingSuccess(booking);
        } else {
            const error = await response.json();
            throw new Error(error.error || 'Có lỗi xảy ra khi đặt lịch');
        }
    } catch (error) {
        hideLoading();
        showAlert('Lỗi đặt lịch: ' + error.message, 'danger');
    }
}

// Show booking success
function showBookingSuccess(booking) {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.id = 'successModal';
    modal.innerHTML = `
        <div class="modal-content">
            <h2>🎉 Đặt lịch thành công!</h2>
            <div class="booking-summary">
                <div class="summary-row">
                    <span class="summary-label">Mã đặt lịch:</span>
                    <span class="summary-value">#${booking.id}</span>
                </div>
                <div class="summary-row">
                    <span class="summary-label">Khách hàng:</span>
                    <span class="summary-value">${booking.userFullName}</span>
                </div>
                <div class="summary-row">
                    <span class="summary-label">Dịch vụ:</span>
                    <span class="summary-value">${booking.serviceName}</span>
                </div>
                <div class="summary-row">
                    <span class="summary-label">Ngày:</span>
                    <span class="summary-value">${formatDisplayDate(booking.date)}</span>
                </div>
                <div class="summary-row">
                    <span class="summary-label">Thời gian:</span>
                    <span class="summary-value">${formatTime(booking.startTime)} - ${formatTime(booking.endTime)}</span>
                </div>
                <div class="summary-row">
                    <span class="summary-label">Trạng thái:</span>
                    <span class="summary-value">${booking.statusDisplayName}</span>
                </div>
            </div>
            <div class="alert alert-info">
                <strong>Lưu ý:</strong> Lịch hẹn của bạn đang ở trạng thái "Chờ xác nhận". Vui lòng đợi quản trị viên duyệt.
            </div>
            <button class="btn btn-primary" onclick="closeModal('successModal'); resetBooking();">
                Đóng
            </button>
        </div>
    `;

    document.body.appendChild(modal);
    modal.style.display = 'block';
}

// Reset booking
function resetBooking() {
    selectedService = null;
    selectedTimeSlot = null;

    // Reset UI
    document.querySelectorAll('.service-card').forEach(card => {
        card.style.borderColor = '#e1e5e9';
    });

    document.querySelectorAll('.time-slot').forEach(slot => {
        slot.classList.remove('selected');
    });

    const timeSelection = document.getElementById('timeSelection');
    const bookingSummary = document.getElementById('bookingSummary');

    if (timeSelection) timeSelection.style.display = 'none';
    if (bookingSummary) bookingSummary.style.display = 'none';

    // showAlert('Đã reset thông tin đặt lịch', 'info'); // Commented out to reduce noise
}

// Utility functions
function formatPrice(price) {
    return new Intl.NumberFormat('vi-VN').format(price);
}

function formatDate(date) {
    return date.toISOString().split('T')[0];
}

function formatDisplayDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

function formatTime(timeString) {
    if(!timeString) return '';
    const [hours, minutes] = timeString.split(':');
    return `${hours}:${minutes}`;
}

function showAlert(message, type) {
    const alertContainer = document.body;
    const alert = document.createElement('div');
    alert.className = `alert alert-${type} fade-in`;
    alert.innerHTML = message;

    alertContainer.appendChild(alert);

    setTimeout(() => {
        alert.classList.add('fade-out');
        alert.addEventListener('transitionend', () => alert.remove());
    }, 5000);
}

function showLoading(message) {
    const loading = document.createElement('div');
    loading.id = 'loadingModal';
    loading.className = 'modal';
    loading.innerHTML = `
        <div class="modal-content text-center">
            <div class="loading mb-2"></div>
            <p>${message}</p>
        </div>
    `;

    document.body.appendChild(loading);
    loading.style.display = 'block';
}

function hideLoading() {
    const loading = document.getElementById('loadingModal');
    if (loading) {
        loading.remove();
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.remove();
    }
}

// Load user bookings
async function loadUserBookings() {
    if (!currentUser) return;

    try {
        const response = await fetch(`/api/bookings/user/${currentUser.id}`);
        if (response.ok) {
            const bookings = await response.json();
            displayUserBookings(bookings);
        } else {
            throw new Error('Không thể tải lịch sử đặt lịch');
        }
    } catch (error) {
        showAlert('Lỗi tải lịch sử: ' + error.message, 'danger');
    }
}

// Display user bookings
function displayUserBookings(bookings) {
    const bookingsContainer = document.getElementById('userBookings');
    if (!bookingsContainer) return;

    if (bookings.length === 0) {
        bookingsContainer.innerHTML = '<p class="text-center">Bạn chưa có lịch hẹn nào.</p>';
        return;
    }

    bookingsContainer.innerHTML = '';

    bookings.forEach(booking => {
        const bookingCard = document.createElement('div');
        bookingCard.className = 'card mb-3'; // Thêm margin-bottom

        const statusClass = getStatusClass(booking.status);

        bookingCard.innerHTML = `
            <div class="card-header d-flex justify-content-between align-items-center">
                <strong>${booking.serviceName}</strong>
                <span class="badge ${statusClass}">${booking.statusDisplayName}</span>
            </div>
            <div class="card-body">
                <p><strong>Ngày:</strong> ${formatDisplayDate(booking.date)}</p>
                <p><strong>Thời gian:</strong> ${formatTime(booking.startTime)} - ${formatTime(booking.endTime)}</p>
                <p><strong>Giá:</strong> ${formatPrice(booking.servicePrice)} VNĐ</p>
                ${booking.notes ? `<p><strong>Ghi chú:</strong> ${booking.notes}</p>` : ''}
                <p class="text-muted small"><strong>Đặt lịch lúc:</strong> ${formatDateTime(booking.createdAt)}</p>
            </div>
        `;

        bookingsContainer.appendChild(bookingCard);
    });
}

function getStatusClass(status) {
    switch (status) {
        case 'PENDING': return 'alert-warning';
        case 'CONFIRMED': return 'alert-success';
        case 'CANCELLED': return 'alert-danger';
        case 'COMPLETED': return 'alert-info';
        case 'RESCHEDULED': return 'alert-warning';
        default: return 'alert-secondary';
    }
}

function formatDateTime(dateTimeString) {
    if(!dateTimeString) return '';
    const date = new Date(dateTimeString);
    return date.toLocaleString('vi-VN');
}