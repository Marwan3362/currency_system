🧠 أوامر Sequelize CLI

الأمر	الوظيفة
npx sequelize-cli init	إنشاء مجلدات config, models, migrations, seeders
npx sequelize-cli model:generate --name User --attributes name:string,email:string	إنشاء model و migration تلقائيًا
npx sequelize-cli migration:generate --name add-column-to-users	إنشاء ملف Migration فاضي
npx sequelize-cli db:migrate	تنفيذ كل الـ migrations اللي متنفذتش
npx sequelize-cli db:migrate:undo	التراجع عن آخر migration
npx sequelize-cli db:seed:all	تنفيذ كل seeders
npx sequelize-cli db:seed:undo	التراجع عن آخر seeder
🐳 أوامر Docker

الأمر	الوظيفة
docker compose up	تشغيل كل الـ services
docker compose up -d	تشغيل في الخلفية
docker compose down	إيقاف وحذف الـ containers
docker ps	عرض الـ containers شغالة
docker exec -it <container-name> sh
docker exec -it <currency_system-db-1> sh

currency_system-db-1
الدخول للـ container (لـ Node و Alpine)
docker exec -it currency_system-db-1 mysql -u root -p	الدخول على MySQL CLI
docker logs <container-name>	عرض اللوجات
✅ اسم الـ container عندك غالبًا:

Node app → currency_system-app-1

DB → currency_system-db-1

🐬 أوامر MySQL CLI بعد الدخول

الأمر	الوظيفة
SHOW DATABASES;	عرض قواعد البيانات
USE exchange_system;	اختيار قاعدة البيانات
SHOW TABLES;	عرض الجداول
DESCRIBE users;	وصف جدول
SELECT * FROM users;	عرض بيانات جدول
🔁 Sequelize Sync (من الكود)

الكود	الوظيفة
sequelize.sync()	ينشئ الجداول لو مش موجودة فقط
sequelize.sync({ alter: true })	يعدل الجداول لتطابق الـ models (خطر في production)
sequelize.sync({ force: true })	يحذف الجداول ويعيد إنشائها (يمسح البيانات)





docker exec -it currency_system-app-1 sh;

docker exec -it currency_system-db-1 mysql -u root -p -> go to databaase in docker

docker exec -it currency_system-db-1 mysql -u root -p


docker exec currency_system-db-1 mysqldump -u root -p root exchange_system > backup.sql
show databases;
USE exchange_system;
SHOW TABLES;
DESCRIBE currencies;
SELECT * FROM users;
SELECT * FROM safe_transfers;
SELECT * FROM transactions;
SELECT * FROM safe_balances;



