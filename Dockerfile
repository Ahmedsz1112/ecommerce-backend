# استخدم صورة Node.js خفيفة
FROM node:18-alpine

# تعيين مجلد العمل داخل الحاوية
WORKDIR /app

# نسخ ملفات التعريف أولاً لتسريع التثبيت (package.json, package-lock.json إذا موجود)
COPY package*.json ./

# تثبيت الاعتمادات (dependencies)
RUN npm install

# نسخ كل ملفات المشروع (بما فيها src)
COPY . .

# بناء المشروع (تحويل TypeScript إلى JavaScript في مجلد dist)
RUN npm run build

# تحديد الأمر الذي يبدأ السيرفر
CMD ["node", "dist/index.js"]

# لو حابب تعرض المنفذ (اختياري في بعض البيئات)
EXPOSE 8080
