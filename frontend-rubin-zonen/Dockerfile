FROM node:20-alpine AS builder
WORKDIR /app
#TODO change for prod
ENV VITE_BASE_URL=http://localhost:3000/api 

COPY package.json package-lock.json ./
RUN npm install

COPY . .

RUN npm run build


FROM nginx:alpine
WORKDIR /usr/share/nginx/html

RUN rm -rf ./*

COPY --from=builder /app/dist .

COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]