# ログイン機能の実装（課題提出）

##  概要

本課題では、フロントエンド・バックエンド・データ保存（SQLite）を含む認証機能（ログイン/登録）を実装しました。
- Backend: FastAPI (Python)
- Frontend: HTML / CSS / Vanilla JavaScript
- DB: SQLite
- Auth: JWT（Bearer Token）
- Password: bcrypt によるハッシュ化

##  システム構成

```
┌─────────────────────────────────────────────────┐
│              Frontend App (Port 3000)           │
│     HTML + CSS + Vanilla JavaScript             │
│  ┌──────────┐ ┌──────────┐  ┌───────────┐       │
│  │ resigter │ │  Login   │  │ Dashboard │       │
│  └──────────┘ └──────────┘  └───────────┘       │
└───────────────────┬─────────────────────────────┘
                    │ HTTP/REST API
                    │ (JSON + JWT Token)
                    ↓
┌─────────────────────────────────────────────────┐
│           Backend API (Port 8000)               │
│              FastAPI Framework                  │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐       │
│  │   API    │  │ Services │  │  Models  │       │
│  │ Endpoints│→ │ (Logic)  │→ │  (Data)  │       │
│  └──────────┘  └──────────┘  └──────────┘       │
└─────────────────────────────────────────────────┘
```


## 起動手順（ローカル）

### ステップ 1: バックエンド 起動

```bash
# バックエンド　ディレクトリに移動
cd backend-api

# 依存関係インストール
pip install -r requirements.txt
# データーベース作成
python -m app.database
# サーバーを起動する
uvicorn main:app --reload
```

バックエンドのアクセス先: http://localhost:8000

### ステップ 2: フロントエンド　起動

```bash
# 新しいターミナルを開く, フロントエンド　ディレクトリに移動
cd frontend-app

# HTTPサーバーを起動
python -m http.server 3000
```

フロントエンドのアクセス先: http://localhost:3000

### ステップ 3: 使い方

1. http://localhost:3000/public/login.html　をブラウザで開く
2. ログインのステップ:
    - Register 画面でユーザーを作成
    - Login 画面で作成したユーザーでログイン
    - 認証成功時、JWT（access_token）を受け取り保持します
　　 ログインできたら、ダッシュボード画面に移動します。

2. 1 トークン検証
取得した token を用いて /api/me（または /api/verify）で認証状態を確認できます。

3. 簡単な設計説明（認証フロー）
    - ユーザーが username/email と password を入力
    - Backend が DB（users）からユーザーを取得
    - bcrypt で password を照合（平文保存はしない）
    - 成功時に JWT（access_token）を発行し、Frontend は token を保持
    - /api/me 等の API で token を検証し、ユーザー情報を取得
## API ドキュメント

- Swagger UI : http://localhost:8000/docs

### APIエンドポイント:

```
POST   /api/register       # ユーザー登録
POST   /api/login          # ログイン
GET    /api/verify         # トークンの検証
GET    /api/me             # ユーザー情報を取得
```

##  認証フロー

1. ユーザーがユーザー名とパスワードを入力
          ↓
2. フロントエンドが POST /api/login を送信
          ↓
3. バックエンドが認証情報を検証
          ↓
4. 有効な場合 → JWTトークンを返却
          ↓
5. フロントエンドがトークンを localStorage に保存
          ↓
6. ダッシュボード画面へリダイレクト
          ↓
7. ダッシュボードがバックエンドにトークンを検証
          ↓
8. ユーザー情報を表示



##  Tech Stack

### バックエンド
| Technology | Version | Purpose              |
|------------|---------|----------------------|
| Python     | 3.8+    | Programming language |
| FastAPI    | 0.104.1 | Web framework        |
| Uvicorn    | 0.24    | ASGI server          |
| PyJWT      | 2.8     | JWT handling         |
| Pydantic   | 2.5     | Data validation      |

### フロントエンド
| Technology       | Purpose       |
|------------------|---------------|
| HTML5            | Structure     |
| CSS3             | Styling       |
| JavaScript (ES6+)| Logic         |
| Fetch API        | HTTP requests |
| LocalStorage     | Token storage |

##  Configuration

### Backend (.env)
```env
PROJECT_NAME=Login System API
DEBUG=True
HOST=0.0.0.0
PORT=8000
SECRET_KEY=your-secret-key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=100080

# Database configuration
DATABASE_URL=sqlite:///./test.db

# CORS Settings (comma-separated)
ALLOWED_ORIGINS=["http://localhost:3000"]
```

### Frontend (config.js)
```javascript
const API_CONFIG = {
    // Base URL of the Backend API
    BASE_URL: 'http://localhost:8000',
    
    // API Endpoints
    ENDPOINTS: {
        REGISTER: '/api/register',
        LOGIN: '/api/login',
        VERIFY: '/api/verify',
        ME: '/api/me'
    },
    
    // Timeout for requests (milliseconds)
    TIMEOUT: 10000,
    
    // Storage keys
    STORAGE_KEYS: {
        ACCESS_TOKEN: 'access_token',
        USER_DATA: 'user_data',
    }
};
```
## 生成AIの利用箇所（利用内容とプロンプト）
### 利用箇所
    - フロントエンドの画面UI（ログイン画面・登録画面・ダッシュボード画面）のHTML/CSSレイアウト作成に生成AIを利用しました。
    - 生成AIの出力はそのまま使用せず、プロジェクト構成に合わせてクラス名・配置・文言等を調整しました。
    - バックエンドの認証ロジック（DB参照・bcrypt照合・JWT発行）は自身で実装しました。

### 利用プロンプト
    - シンプルなログイン画面のHTML/CSSを作成してください。username/email入力、password入力、ログインボタン、エラーメッセージ表示領域を含めてください。
    - 登録画面のフォーム（username, email, password, Confirm Password）をログイン画面と同じデザインで作成してください。
    入力バリデーション用のエラー表示も用意してください。
    - ログイン後のダッシュボード画面の簡易テンプレートを作成してください。ユーザー名・メールの表示欄とログアウトボタンを含めてください。
