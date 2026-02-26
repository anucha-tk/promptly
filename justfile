# โหลด Environment Variables จากไฟล์ .env (ถ้ามี)
export DOTENV_LOADED := "true"

# รายการคำสั่งทั้งหมด (รัน `just` เฉยๆ เพื่อดูลิสต์นี้)
default:
    @just --list

# --- Firebase Operations ---

# Deploy เฉพาะ Firestore Indexes
deploy-indexes:
    firebase deploy --only firestore:indexes

# Deploy Firestore Rules และ Indexes พร้อมกัน
deploy-firestore:
    firebase deploy --only firestore:rules,firestore:indexes

# รัน Firebase Emulator สำหรับ Local Development (Firestore + Auth)
dev:
    firebase emulators:start --import=./seed-data --export-on-exit

# --- Application Tasks (JS/TS Focus) ---

# Build โปรเจกต์ (ถ้าคุณใช้ Vite หรือ Esbuild)
build:
    npm run build

# เช็ค Lint และ Type-check (เหมาะสำหรับทำ CI/CD)
check:
    npx tsc --noEmit
    npm run lint

# --- Utility ---

# ล้าง Cache และลบโฟลเดอร์ dist/node_modules
clean:
    rm -rf dist node_modules
    @echo "Project cleaned."
