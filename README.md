# Hành trình Blockchain

Web app tĩnh dùng trên lớp để sinh viên học blockchain bằng trải nghiệm có khóa bước:

`Thử hành động -> bị chặn hoặc đi qua gate -> đọc giải thích đúng lúc -> trả lời quiz gate -> mở bước tiếp theo`

## Cách Chạy

Mở trực tiếp trên GitHub Pages:

`https://fandzung.github.io/blockchainsimulation/`

Hoặc chạy local bằng cách mở `index.html`, hay serve thư mục này bằng static web server.

## Ý Đồ Sư Phạm

App không phải là dashboard demo để bấm tự do. Sinh viên đóng vai một node trong mạng blockchain và phải đi qua từng cơ chế theo trình tự:

1. Intro mission
2. Chọn giao dịch hợp lệ từ mempool
3. Tạo block ứng viên
4. Thử nonce thủ công
5. Auto-mine và thêm block vào chain
6. Tạo block thứ hai và quan sát previous hash
7. Sửa dữ liệu cũ để làm chain invalid
8. Re-mine sau khi sửa lịch sử
9. Fork và đồng thuận
10. Final challenge

Mỗi bước bị khóa cho đến khi sinh viên hoàn thành hành động của bước trước và vượt quiz gate.

## Thành Phần Học Tập

- **Mission map**: cho thấy bước nào đang mở, bước nào bị khóa, bước nào đã hoàn thành.
- **Simulation area**: nơi sinh viên thao tác với transaction, block, nonce, mining, chain, tamper, fork.
- **Learning panel**: chỉ giải thích đúng phần liên quan tới bước hiện tại.
- **Gate status**: transaction gate, mining gate, chain link gate, consensus gate.
- **Hint credit**: sinh viên phải trả lời mini-quiz để mua hint.
- **Dictionary**: thuật ngữ mở khóa dần theo bước, không hiện toàn bộ từ đầu.
- **Quiz gate**: câu hỏi tình huống, dùng để mở bước tiếp theo.
- **Learning log**: ghi lại invalid transaction attempts, nonce attempts, blocks mined, tamper result, hints used, quiz attempts.

## Yêu Cầu Kỹ Thuật

- Hosting: GitHub Pages hoặc static web host.
- Backend: không cần.
- Database: không cần.
- Tài khoản sinh viên: không cần.
- Trình duyệt: Chrome, Edge, Firefox, Safari hiện đại có bật JavaScript.

## GitHub Pages

Repo đã có workflow `.github/workflows/pages.yml`. Mỗi lần push lên `main`, GitHub Actions sẽ deploy lại Pages.
