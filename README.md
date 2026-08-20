# 🎂 Chúc Mừng Sinh Nhật — Guild Thần Thoại

Trang web chúc mừng sinh nhật làm riêng cho guild **Thần Thoại** (Gunny PC).

👉 **[Xem trang tại đây](https://kendidang2k.github.io/happy-birthday/)**

## Có gì trong này

- Màn mở quà với huy hiệu guild trong vòng gold xoay lấp lánh
- Băng rôn cờ giấy treo võng, đung đưa trong gió
- Bánh kem vẽ bằng CSS — **thổi tắt nến bằng micro thật** (hoặc bấm chuột)
- Thổi xong nến thì **trời chuyển sang đêm**: sao hiện ra, trăng lưỡi liềm nhô lên, sao băng bay ngang
- Pháo hoa bắn liên tục từ hai góc trên màn hình
- **Sổ lưu bút**: khách để lại lời chúc, lời chúc bay lên trời theo bóng bay — bấm vỡ bóng là đọc được
- Thiệp lật 3D, pháo giấy, cánh hoa bay, mây trôi, cầu vồng
- Gói gọn trong đúng một khung hình, không cần cuộn

## Cấu trúc

```
index.html          bố cục trang
style.css           toàn bộ giao diện và hoạt ảnh
js/effects.js       mọi hiệu ứng + sổ lưu bút
js/typed.min.js     thư viện chữ gõ máy
img/                logo guild
music.mp3           nhạc nền
```

## Chỉnh nội dung

Mọi thứ nằm trong object `CONFIG` ở đầu [js/effects.js](js/effects.js):

| Trường | Ý nghĩa |
|---|---|
| `name` | Tên hiển thị to giữa trang |
| `who` | Cách xưng hô trong lời chúc |
| `banner` | Chữ trên băng rôn cờ giấy |
| `candles` | Số nến trên bánh |
| `lines` | Các dòng chữ gõ máy |
| `wish` | Nội dung tấm thiệp |
| `wishes.firebaseUrl` | Nơi lưu sổ lưu bút (xem bên dưới) |

Có thể đổi tên qua URL: `?name=Dii&who=chị Dii`

## Sổ lưu bút

Lời chúc của khách được lưu trên **Firebase Realtime Database**. Để trống
`wishes.firebaseUrl` thì lời chúc chỉ nằm trong máy người gửi.

Quy tắc bảo mật nên đặt như sau — ai cũng đọc và thêm mới được, nhưng
không ai sửa hay xoá được lời chúc đã có:

```json
{
  "rules": {
    "wishes": {
      ".read": true,
      "$id": {
        ".write": "!data.exists() && newData.exists()",
        ".validate": "newData.hasChildren(['name','msg']) && newData.child('name').isString() && newData.child('name').val().length <= 40 && newData.child('msg').isString() && newData.child('msg').val().length <= 300"
      }
    }
  }
}
```

Muốn xoá lời chúc thì vào Firebase Console → Realtime Database → tab Dữ liệu.

---

Đoàn kết ♥ Sống tình ♥ Mãi là anh em
