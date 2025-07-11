FROM python:3.11-slim-bullseye

WORKDIR /app

# Install system dependencies and ODBC driver prerequisites
RUN apt-get update && \
    apt-get install -y curl gnupg2 unixodbc-dev gcc && \
    curl https://packages.microsoft.com/keys/microsoft.asc | apt-key add - && \
    curl https://packages.microsoft.com/config/debian/11/prod.list > /etc/apt/sources.list.d/mssql-release.list && \
    apt-get update && \
    ACCEPT_EULA=Y apt-get install -y msodbcsql18 && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

COPY requirements.txt /app/

COPY . /app/backend

RUN pip install --no-cache-dir -r /app/requirements.txt \
    && pip install gunicorn "uvicorn[standard]"

ENV PYTHONPATH=/app

EXPOSE 8000

CMD ["gunicorn", "-k", "uvicorn.workers.UvicornWorker", "backend.app:app", "-b", "0.0.0.0:8000", "--workers", "1"]