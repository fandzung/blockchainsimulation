# Mô phỏng đào Blockchain

Web app tĩnh dùng trên lớp để dạy luồng vận hành cơ bản của blockchain:

`Transaction -> Mempool -> Block -> Hash -> Mining -> Chain -> Tamper -> Consensus`

## Chạy Trên Máy

Mở `index.html` bằng trình duyệt, hoặc serve thư mục này bằng bất kỳ static web server nào.

## Đưa Lên GitHub Pages

1. Push thư mục này lên một GitHub repository.
2. Mở phần settings của repository.
3. Vào Pages.
4. Chọn branch và root folder.
5. Mở URL GitHub Pages được tạo.

Không cần backend, database, ví crypto, MetaMask, hoặc tài khoản GitHub cho sinh viên.

## Yêu Cầu Kỹ Thuật Và Kết Nối

- Hosting: GitHub Pages hoặc bất kỳ static web host nào.
- Runtime: trình duyệt hiện đại có bật JavaScript.
- Tài khoản sinh viên: không cần.
- Backend: không cần.
- Database: không cần.
- Wallet hoặc MetaMask: không cần.
- Internet: cần để tải URL ban đầu. Sau khi tải xong, mô phỏng chạy trong trình duyệt.
- Thiết lập lớp học: một thiết bị cho mỗi nhóm sinh viên là đủ.
- Phương án dự phòng: tải repository dạng ZIP và mở/serve local nếu mạng lớp học chặn GitHub Pages.

## Cách Dùng Trong Lớp

- Dùng phần hướng dẫn ở đầu app.
- Sinh viên theo tab Sinh viên như checklist thao tác.
- Giảng viên chuyển sang tab Giảng viên để xem gợi ý điều phối và điều kiện hoàn thành.
- Dùng panel Cổng cơ chế làm bề mặt giảng dạy chính: mỗi hành động quan trọng nên tạo ra một khoảnh khắc đi qua, bị chặn, bị reject, hoặc verify, kèm giải thích.
- Sinh viên chọn transaction từ mempool.
- Sinh viên đào block bằng cách tìm nonce làm hash bắt đầu bằng đủ số 0 theo độ khó.
- Chain view cho thấy mỗi block liên kết với block trước bằng previous hash.
- Tamper lab cho thấy vì sao sửa dữ liệu cũ làm chain invalid.
- Fork lab cho thấy các block hợp lệ có thể cạnh tranh và cần consensus.
- Quiz kiểm tra sinh viên có hiểu cơ chế phía sau từng bước hay không.

## Có Cần Tách Giao Diện Không?

Phiên bản này dùng một giao diện chung với tab Sinh viên và Giảng viên. Cách này giữ setup đơn giản cho GitHub Pages và không cần account hoặc phân quyền.

Chỉ nên tách riêng giao diện instructor/student nếu lớp học cần ẩn đáp án quiz, xuất điểm, phòng multiplayer, hoặc control chỉ dành cho giảng viên.

## Hoàn Thành Assignment

Giảng viên đặt điểm đạt trong phần quiz. Một nhóm được coi là hoàn thành khi kết quả quiz hiện `Assignment đã hoàn thành`.

Gợi ý ngưỡng điểm:

- 70% cho buổi nhập môn đầu tiên.
- 80% nếu sinh viên đã có tài liệu đọc trước.
- 90% cho kiểm tra mastery có tính điểm.

Quiz được thiết kế để kiểm tra cơ chế, không kiểm tra học thuộc:

- vì sao transaction không hợp lệ bị chặn;
- mempool là gì;
- vì sao previous hash nối lịch sử;
- miner tìm gì trong Proof-of-Work;
- vì sao node phải verify block;
- reward nên được ghi nhận khi nào;
- vì sao tamper làm chain invalid;
- fork và consensus hoạt động như thế nào.
