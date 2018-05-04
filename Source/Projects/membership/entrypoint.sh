#!/bin/bash

set -e
run_cmd="dotnet run --server.urls http://*:22530"

until dotnet ef database update -c ApplicationDbContext;
do
  >&2 echo "Database Server Starting Up"
  sleep 1
done

until dotnet ef database update -c ConfigurationDbContext;
do
  sleep 1
done

until dotnet ef database update -c PersistedGrantDbContext;
do
  sleep 1
done

>&2 echo "Database Server up - starting service"
exec $run_cmd
