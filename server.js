const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
app.use(cors()); // CORS許可

const PASSWORD = "mysecretpassword";
const UPLOAD_DIR = './uploads';
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR);

// 保存設定
const storage = multer.diskStorage({
    destination: UPLOAD_DIR,
    filename: (req, file, cb) => cb(null, file.originalname)
});
const upload = multer({ storage: storage });

// パスワード確認関数
const auth = (req, res, next) => {
    const pw = req.headers['x-password'] || req.query.pw;
    if (pw === PASSWORD) return next();
    res.status(401).send("NG");
};

// 1. トップページ
app.get('/', (req, res) => res.send("JSサーバー稼働中"));

// 2. アップロード
app.post('/upload', auth, upload.single('file'), (req, res) => {
    res.json({ status: "ok" });
});

// 3. 一覧取得
app.get('/files', auth, (req, res) => {
    const files = fs.readdirSync(UPLOAD_DIR);
    res.json(files);
});

// 4. ダウンロード
app.get('/download/:name', auth, (req, res) => {
    res.download(path.join(__dirname, UPLOAD_DIR, req.params.name));
});

app.listen(3000, () => console.log("Server running on port 3000"));
