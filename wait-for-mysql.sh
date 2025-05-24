#!/bin/sh

HOST="$1"
PORT="$2"
shift 2

echo "Waiting for MySQL to be ready at $HOST:$PORT..."
until nc -z -v -w30 $HOST $PORT
do
  echo "MySQL is unavailable - sleeping"
  sleep 5
done

echo "MySQL is up and running!"
exec "$@"
