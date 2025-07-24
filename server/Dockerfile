# ипользуем образ линукс Alpine с версией node 14
FROM node:20.10.0-alpine

# Создание тома для хранения фотографий
RUN mkdir -p /static/avatars \
    && mkdir -p /static/projects \
    && mkdir -p /static/news \
    && mkdir -p /extracted

# Копирование фотографий в том
COPY ./static/avatars /static/avatars
COPY ./static/projects /static/projects
COPY ./static/news /static/news
COPY ./extracted /extracted


# Указываем корневую папку
WORKDIR /app

# Скопировать package.json и package-lock.json внутрь контейнера
COPY package*.json ./

# Устанавливаем зависимости
RUN npm install

# Копируем оставшееся пролижение в контейнер
COPY . .

# Открыть порт в нашем контейнере
EXPOSE 3000

# Запускаем наш сервер
CMD [ "npm", "start" ]