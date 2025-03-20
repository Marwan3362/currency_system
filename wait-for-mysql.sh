#!/bin/sh

echo "Waiting for MySQL to be ready at $DB_HOST:3306..."
until nc -z -v -w30 $DB_HOST 3306
do
  echo "MySQL is unavailable - sleeping"
  sleep 5
done

echo " MySQL is up and running!"

exec "$@"
