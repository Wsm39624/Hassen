# استخدام نسخة بايثون خفيفة ومستقرة
FROM python:3.10-slim

# تثبيت الأدوات النظامية (Tesseract OCR، اللغة العربية والإنجليزية، وحزم Poppler للـ PDF)
RUN apt-get update && apt-get install -y \
    tesseract-ocr \
    tesseract-ocr-ara \
    tesseract-ocr-eng \
    poppler-utils \
    && rm -rf /var/lib/apt/lists/*

# تحديد مجلد العمل داخل السيرفر
WORKDIR /app

# نسخ وتثبيت مكتبات بايثون
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# نسخ بقية ملفات مشروع حصين إلى السيرفر
COPY . .

# أمر تشغيل السيرفر عبر خادم الإنتاج gunicorn
CMD ["gunicorn", "--bind", "0.0.0.0:5000", "app:app"]