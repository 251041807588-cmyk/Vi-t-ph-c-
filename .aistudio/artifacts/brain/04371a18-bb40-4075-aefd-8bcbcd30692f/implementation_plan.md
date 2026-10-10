# Kế Hoạch Thiết Kế Chuẩn Họa Tiết Áo Trạm 1 (Đông Sơn Remix) & Tích Hợp Studio

Dựa trên ảnh mẫu 4 Trạm lịch sử và đoạn mã nguồn tương tác `RemixDongSon` của Trạm 1 (Đông Sơn), tài liệu này phác thảo giải pháp thiết kế đồ họa chi tiết và tích hợp trực tiếp vào phòng thử đồ Studio.

---

## 1. Phân Tích Hình Ảnh Mẫu Trạm 1 (Văn Hóa Đông Sơn)
Từ ảnh mẫu Trạm 1, nhân vật búp bê Popmart mang các đặc trưng tạo hình chuẩn xác:
- **Áo yếm đỏ đất (Họa tiết Trống Đồng):** Phom yếm cổ tròn khoét nách duyên dáng, nền vải màu đỏ đất nung (terracotta/crimson), tâm ngực thêu mặt trời nhiều tia và vành chim Lạc chỉ vàng đồng.
- **Chân váy đúp chữ A (Họa tiết chim Lạc):** Váy dài ngang bắp chân xòe chữ A hai lớp, vạt đúp dọc thân trước thêu họa tiết hình học, vòng tròn tiếp tuyến và chim Lạc sải cánh, chân váy viền răng cưa.
- **Vòng cổ hình học (Đúc bằng đồng cổ):** Kiềng cổ bản to bằng đồng thau ánh kim (antique bronze), chạm khắc các chấm dải nổi và hoa văn kỷ hà; kèm vòng xuyến đeo tay đồng.
- **Dây buộc tóc lụa & Kiểu tóc:** Tóc đen chải suôn tết bím lệch vắt qua một bên vai, buộc bằng dây lụa đỏ thắt tua rua vàng đồng phong cách Boho-chic nguyên sơ.
- **Bối cảnh & Chân trần:** Chân trần mộc mạc trên thảm cỏ làng cổ, cạnh bên là trống đồng Đông Sơn và mái nhà sàn mộc mạc.

---

## 2. Kế Hoạch Triển Khai Chi Tiết

### Bước 1: Chuẩn Hóa Dữ Liệu 4 Món Đồ Đông Sơn (`data/historical-data.ts`)
Bổ sung và định nghĩa chuẩn xác 4 món đồ trong kho dữ liệu của Trạm 1:
1. `aoYem_dongSon`: Áo yếm đỏ đất (Category: `innerwear`/`ao`, Họa tiết Trống Đồng, bonus +1 sao).
2. `chanVay_dongSon`: Chân váy đúp chữ A (Category: `bottom`/`quan`, Họa tiết chim Lạc, bonus +1 sao).
3. `vongCo_dongSon`: Vòng cổ hình học (Category: `accessories`/`tsuc`, Đúc bằng đồng cổ, bonus +1 sao).
4. `dayBuocToc_dongSon`: Dây buộc tóc lụa & Bím tóc Boho (Category: `hair`/`toc`, Dây lụa tết viền vàng, bonus +1 sao).

### Bước 2: Thiết Kế Lớp Đồ Họa Vector SVG Chuẩn Xác Trong `PopmartDollVisualizer.tsx`
Bổ sung các định nghĩa SVG tinh xảo bám sát từng milimet của ảnh mẫu:
- **SVG Áo Yếm Đỏ Đất:**
  - Gradient màu đỏ gốm nung `#992D1B` -> `#781D10` viền chỉ vàng `#F59E0B`.
  - Họa tiết ngôi sao 12 cánh ở ngực yếm, dải chim Lạc bay quanh tâm.
- **SVG Chân Váy Đúp Chữ A:**
  - Dáng váy xòe chữ A với dải tà đúp trung tâm thêu hoa văn người giã gạo, chim Lạc bay và dải răng lược Đông Sơn.
- **SVG Vòng Cổ Đồng Bản To:**
  - Vòng kiềng cổ đúc đồng vàng ngả ánh rêu `#D97706` / `#B45309`, chạm khắc nổi hoa văn hình học Đông Sơn và đôi lắc tay đồng hai bên.
- **SVG Tóc Tết Bím Lệch & Dây Lụa:**
  - Tóc tết bím dài vắt lệch qua vai trái, buộc nơ lụa đỏ tua rua vàng đồng.

### Bước 3: Tích Hợp Cơ Chế Đánh Giá & Chấm Sao Động
- Khi người mẫu ở trạng thái mặc định (áo ba lỗ trắng & quần short xám ở nhà): **1 Sao** kèm phản hồi:
  > *"Bạn đang ở trạng thái chuẩn bị. Hãy thử khoác lên các món Việt Phục cổ để sẵn sàng tham gia lễ hội dã ngoại nào!"*
- Khi mặc từng món: Tăng điểm sao tương ứng (+1 sao cho mỗi món đồ Đông Sơn).
- Khi mặc đủ Áo Yếm + Chân Váy:
  > *"Tuyệt vời! Bạn đã hoàn thiện phom dáng y phục cơ bản. Các họa tiết hình học và chim Lạc lấy cảm hứng từ trống đồng Đông Sơn đang giúp bạn tôn vinh sự hòa hợp với thiên nhiên."*
- Khi hoàn thiện cả 4 món: **5 Sao** kèm danh hiệu **"Chiến Thần Bản Sắc"** và phản hồi:
  > *"Xuất sắc! Bộ trang phục đạt độ hoàn chỉnh 5 sao. Sự kết hợp giữa Áo Yếm, Váy Chữ A hai lớp cùng trang sức đồng bản to tạo nên vẻ đẹp Boho-chic hoang dã nhưng đậm tính dân tộc, tôn vinh tín ngưỡng phồn thực Đông Sơn."*

### Bước 4: Đồng Bộ Giao Diện Studio & Tủ Đồ Trạm 1
- Đặt tab hoặc bộ lọc nhanh "Bộ Đông Sơn Remix" trong tủ đồ Trạm 1 để người dùng dễ dàng tìm kiếm và tự chọn từng món.
- Cập nhật banner thông tin và thẻ sưu tập (Heritage Collector Card) phản ánh chính xác các họa tiết di sản Trống Đồng và Chim Lạc.
- Kiểm tra tính tương thích và xác minh build với `compile_applet` và `lint_applet`.
