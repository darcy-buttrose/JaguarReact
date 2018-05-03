FROM microsoft/dotnet:latest

COPY . /app

WORKDIR /app

RUN ["dotnet", "restore"]

RUN ["dotnet", "build"]

EXPOSE 22530/tcp

CMD ["dotnet", "watch", "run", "--server.urls", "http://*:22530"]
