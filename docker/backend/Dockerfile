# syntax=docker/dockerfile:1
FROM python:3
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
WORKDIR /app
COPY ./backend/requirements.txt /app/
RUN pip install -r requirements.txt
COPY ./backend/ /app/
RUN rm -rf */__pycache__
RUN rm -rf db.sqlite3
COPY ./docker/backend/ /app
RUN chmod +x /app/*.sh