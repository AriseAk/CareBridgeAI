FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install -r requirements.txt

COPY chat.py .

EXPOSE 7860

CMD ["gunicorn", "chat:app", "--timeout", "120", "--workers", "1", "--bind", "0.0.0.0:7860"]