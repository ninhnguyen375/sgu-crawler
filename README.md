## Crawler App

Lây thông tin sv trên trang thongtindaotao.sgu.edu.vn

### 1. Chạy file setup.sh

```
$ bash setup.sh
```

#### Nhập vào INITIAL_STUDENT_ID và COLLECTION_NAME, Ví dụ:

- INITIAL_STUDENT_ID: 3117410000
- COLLECTION_NAME: CNTT_K17

### 2. Cài đặt các dependency

```
$ yarn
$ #or
$ npm install
```

### 3. Bắt đầu crawl

```
$ yarn start
$ #or
$ npm start
```

### 4. Xong, chọn Full Crawl và đợi thôi.

#### NOTE: Trong lúc crawl có thể thiếu nhiều dữ liệu, nên có thể chọn Recrawl để đảm bảo dữ liệu là đầy đủ nhất.

### 5. Nếu đã chắc chắn với data, chọn Append to db.json, dữ liệu trong db.json là cuối cùng.

---
