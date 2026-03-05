FROM node:20-bullseye

RUN apt-get update && apt-get install -y \
libglib2.0-0 \
libnss3 \
libnspr4 \
libatk1.0-0 \
libatk-bridge2.0-0 \
libcups2 \
libdrm2 \
libxkbcommon0 \
libxcomposite1 \
libxdamage1 \
libxfixes3 \
libxrandr2 \
libgbm1 \
libasound2 \
libpangocairo-1.0-0 \
libpango-1.0-0 \
libcairo2 \
libatspi2.0-0 \
libgtk-3-0 \
wget \
ca-certificates

WORKDIR /app

COPY package*.json ./

RUN npm install

RUN npx playwright install chromium

COPY . .

CMD ["node", "server.js"]
