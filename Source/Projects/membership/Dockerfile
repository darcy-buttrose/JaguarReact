FROM microsoft/dotnet:2.0-sdk

COPY . /app

WORKDIR /app

RUN ["dotnet", "restore"]

RUN ["dotnet", "build"]

EXPOSE 22530/tcp

CMD ["dotnet", "watch", "run", "--server.urls", "http://*:22530"]
