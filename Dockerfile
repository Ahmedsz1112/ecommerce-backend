# نستخدم صورة Node.js خفيفة مع Alpine
FROM node:18-alpine

# نحدد مجلد العمل داخل الحاوية
WORKDIR /app

# ننقل ملفات package.json و package-lock.json فقط (لتثبيت الحزم فقط لو تغيّرت هذه الملفات)
COPY package*.json ./

# نثبت الحزم
RUN npm install

# ننقل باقي ملفات المشروع (الكود المصدري)
COPY . .

# نبني المشروع (تحويل TypeScript إلى JavaScript)
RUN npm run build

# نحدد البورت الذي يعمل عليه التطبيق (اختياري للتوثيق)
EXPOSE 8080

# الأمر الافتراضي لتشغيل التطبيق
CMD ["node", "dist/index.js"]
