export function formatDateTime(dateString) {
    // Đảm bảo dateString là giá trị hợp lệ
    if (!dateString) return 'Không có ngày';

    // Chuyển đổi thành đối tượng Date
    const date = new Date(dateString);

    // Kiểm tra nếu date không hợp lệ
    if (isNaN(date.getTime())) return 'Ngày không hợp lệ';

    return date.toLocaleString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}
