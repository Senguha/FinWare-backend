# Курсовой проект по предмету "Управление базами данных"
Тема: Разработка СУБД по предметной области «Анализ динамики показателей финансовой отчетности различных предприятий» на основе MySQL

[**Клиентская часть**](https://github.com/Senguha/FinWare-frontend)      **Серверная часть**

## Установка
> Протестировано на версии NodeJS 18.18.2

   1. Склонируйте репозирорий в удобную для вас директорию

```
git clone https://github.com/Senguha/FinWare-frontend.git
```
   2. Установите необходимые зависимости

```
npm i
```
   3. Создайте .env файл и внесите в него строку подключения к базе данных и секретную строку для подписей JWT токенов.
```
JWT_SECRET = "your_secret"
DATABASE_URL = "mysql://root:root@localhost:3306/finware"
```
  > В случае использования БД PostgreSQL необходимо заменить файл [prisma/schema.prisma](https://github.com/Senguha/FinWare-backend/blob/main/prisma/schema.prisma) на [prisma/Postgresschema.prisma](https://github.com/Senguha/FinWare-backend/blob/main/prisma/Postgresschema.prisma)

4. Перенесите схему данных из файла schema.prisma в базу MySQL.
```
npx prisma db push
```

5. Внесите в базу данных информацию о сущностях-справочниках "countries" и "parametres" и учётной записи администратора.
```
npx prisma db seed
```
> Данные для входа в учётную запись: admin:admin

6. Сгенерируйте клиент Prisma ORM
```
npx prisma generate
```      

7. Запустите приложение. Оно будет доступно по адресу http://localhost:5000/
```
npm run dev
```

## Диаграммы БД

### Концептуальная модель в нотации Чена
![ERChen](diagrams/Chenerdiagram.png)
### Логическая модель в нотации Мартина
![ERMartin](diagrams/Entityrelationshipdiagram.png)
### Схема данных
   ![Database schema](diagrams/dataSchema.png)
