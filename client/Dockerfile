FROM node:23-bookworm-slim

WORKDIR /app

COPY package.json .

RUN npm install

COPY . .

# still dev
EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host"]