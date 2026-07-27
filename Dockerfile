FROM python:3.11-slim
WORKDIR /app
COPY server.py .
COPY index.html .
COPY hero.png .
COPY sales ./sales
COPY sales_bot.py .
COPY .env.example .env.example
ENV HOST=0.0.0.0
ENV PORT=10000
ENV PYTHONUNBUFFERED=1
EXPOSE 10000
CMD ["python", "-u", "server.py"]
