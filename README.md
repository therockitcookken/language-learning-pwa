# 🏭 Factory Language Learning PWA (Ứng Dụng Học Tiếng Trung & Tiếng Anh Công Xưởng)

Ứng dụng Progressive Web Application (PWA) hoàn chỉnh, chạy thực tế, dành cho công nhân nhà máy, kỹ thuật viên sản xuất, quản lý chuyền, nhân viên kiểm tra chất lượng (QC), bảo trì cơ khí, kho vận và an toàn lao động.

---

## 🌟 Tính Năng Nổi Bật

1. **Từ điển & Từ vựng 3 Chiều**:
   - Tra cứu Việt – Trung – Anh – Nhật/Đài với chữ Hán Giản thể, Phồn thể, Pinyin có dấu, Pinyin dạng số (`an1 quan2`), IPA tiếng Anh và nghĩa tiếng Việt.
   - 2,000+ từ vựng tiếng Trung & 2,000+ từ vựng tiếng Anh công nghiệp.
   - Hơn 1,000 thuật ngữ chuyên ngành: An toàn lao động, PPE, Dây chuyền sản xuất, Máy mài, Máy tiện CNC, Máy ép nhựa, Khuôn mẫu, Thước kẹp du xích, Kiểm tra QC, Ca làm & Lương thưởng.
2. **Hệ thống Phát âm (Sound Engine)**:
   - Phát âm chuẩn tự động Web Speech API + Web Audio API frequency synthesizer (không phụ thuộc API trả phí).
   - Bảng Pinyin (Thanh mẫu, Vận mẫu, Thanh điệu) & IPA (Nguyên âm, Phụ âm) kèm mô tả khẩu hình và hướng luồng hơi.
   - Ghi âm giọng người dùng và chấm điểm chính xác (Thanh mẫu, Vận mẫu, Thanh điệu).
3. **Ngữ pháp Công xưởng**:
   - 500 bài ngữ pháp (250 tiếng Trung + 250 tiếng Anh) với công thức, giải thích, ví dụ Đúng/Sai và tình huống nhà máy.
4. **Flashcard Spaced Repetition (SM-2)**:
   - Thẻ lật 3D với phím tắt điều khiển bàn phím: `Phím Cách` (Lật thẻ), `1` (Again), `2` (Hard), `3` (Good), `4` (Easy).
   - Tự động tính toán lịch ôn tập và khoảng ngày lặp lại.
5. **Quiz & Kiểm tra 18+ Dạng câu hỏi**:
   - Đếm ngược thời gian chống đoán mò, chọn nghĩa, chọn Pinyin, chọn IPA, điền từ, sắp xếp câu, trắc nghiệm an toàn.
   - Thống kê điểm số, phân tích lỗi sai và hiệu ứng pháo hoa mừng thành tích.
6. **Bản đồ Nhà máy 2D (Interactive Factory Map)**:
   - Bản đồ trực quan 5 khu vực: An toàn & PCCC, Dây chuyền sản xuất, Trạm Bảo trì CNC, Phòng QC, Kho Hàng.
7. **Chế độ Khách & Quản trị Admin**:
   - Chạy ngay ở chế độ Khách (Guest) không bắt buộc đăng nhập.
   - Trang Admin quản lý từ vựng, import pipeline CSV/JSON và xem lịch sử Audit Log.

---

## 🛠️ Công Nghệ Sử Dụng (Tech Stack)

- **Frontend**: Next.js 16 (App Router), React 19, TypeScript (Strict Mode), Tailwind CSS v4, Lucide Icons, Canvas Confetti.
- **Backend & API**: Next.js Server Services, REST API validation, Role-Based Access Control (RBAC).
- **Database & ORM**: SQLite / PostgreSQL, Prisma ORM 6.
- **Testing**: Vitest & React Testing Library.
- **PWA & Offline**: Web Speech API & Web Audio API synthesis.

---

## 🚀 Hướng Dẫn Cài Đặt & Vận Hành

### 1. Yêu cầu môi trường
- Node.js `>= 20.0.0`
- pnpm (hoặc npm)

### 2. Cài đặt Dependencies & Khởi tạo Database
```bash
# Di chuyển vào thư mục ứng dụng web
cd apps/web

# Cài đặt thư viện
pnpm install

# Tạo file cấu hình môi trường từ template
cp .env.example .env

# Đồng bộ schema Database (SQLite)
pnpm exec prisma db push

# Nạp dữ liệu seed thật (2,000+ từ vựng Trung/Anh, 500 bài ngữ pháp, 3,000+ câu hỏi quiz)
pnpm db:seed
```

### 3. Chạy môi trường Development
```bash
pnpm dev
# Mở trình duyệt tại http://localhost:3000
```

### 4. Chạy Kiểm thử (Automated Tests)
```bash
pnpm test
```

### 5. Build Production & Chạy Docker
```bash
# Build production bundle
pnpm build
pnpm start

# Hoặc chạy bằng Docker Compose
docker-compose up -d --build
```

---

## 🔐 Hướng Dẫn Tạo Tài Khoản Admin

Mặc định khi chạy script seed, hệ thống tự động khởi tạo tài khoản Admin phát triển:
- **Tên đăng nhập**: `admin`
- **Email**: `admin@factory-lang.com`
- **Mật khẩu**: `adminpassword123`

---

## 📄 Báo Cáo Đánh Giá & Giấy Phép Dữ Liệu
- Danh mục nguồn dữ liệu: [`data-sources.md`](./data-sources.md)
- Giấy phép dữ liệu công khai: [`data-license.md`](./data-license.md)
- Báo cáo chất lượng dữ liệu: [`data-quality-report.md`](./data-quality-report.md)
- Báo cáo 10 Vòng Review: [`/reports/review-01`](./reports/review-01) đến [`/reports/review-10`](./reports/review-10)
