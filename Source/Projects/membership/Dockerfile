FROM microsoft/dotnet:latest

COPY . /app

WORKDIR /app

RUN ["dotnet", "restore"]

RUN ["dotnet", "build"]

EXPOSE 22530/tcp

RUN chmod +x ./entrypoint.sh
CMD /bin/bash ./entrypoint.sh
