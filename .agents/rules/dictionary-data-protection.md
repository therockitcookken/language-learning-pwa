---
name: Dictionary Data Protection
description: Rule to prevent arbitrary edits to the factory dictionary data
---

# Quy tắc nghiêm ngặt: Bảo vệ dữ liệu Từ điển Công xưởng

**Nghiêm cấm** việc tự ý chỉnh sửa, xóa, hoặc thay đổi bất kỳ dữ liệu nào thuộc về tab "Từ điển công xưởng" (Factory Dictionary) hoặc các file dữ liệu tương ứng (như `en-3k.json`, `zh-3k.json`, `chinese-vocab.ts`, v.v.) trừ khi có yêu cầu **RÕ RÀNG VÀ CỤ THỂ** từ người dùng.

1. **Không sửa đổi tự ý**: Bất kỳ cập nhật nào về từ vựng, hình ảnh, ngữ nghĩa phải được người dùng chỉ định rõ.
2. **Sử dụng tài nguyên ngoài**: Khi thêm hình ảnh/assets, CHỈ SỬ DỤNG đường dẫn liên kết (URL) hợp lệ. KHÔNG tải thẳng file hình ảnh/video vào dự án để tránh làm nặng repository.
3. **Phạm vi áp dụng**: Tất cả các file trong `apps/web/src/lib/data/` (và các file cấu hình liên quan đến dictionary/flashcards).
