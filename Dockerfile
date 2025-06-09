# استخدم صورة Node مناسبة
FROM node:20-alpine

# تعيين مجلد العمل داخل الحاوية
WORKDIR /app

# نسخ ملفات التعريف أولاً للاستفادة من caching
COPY package.json package-lock.json ./

# تثبيت الاعتمادات
RUN npm ci

# نسخ بقية ملفات المشروع
COPY . .

# بناء المشروع إذا كان لديك سكريبت build (اختياري)
# RUN npm run build

# فتح المنفذ الذي يستخدمه السيرفر
EXPOSE 8080

# تشغيل التطبيق (ts-node أو build)
CMD ["npx", "ts-node", "src/index.ts"]
