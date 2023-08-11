@echo off

    @FOR /f "tokens=*" %%i IN ('docker-machine env manjjUserInfra ') DO @%%i

    docker ps --filter "name=chrome_1" >> BREAK > E:\zap\backend\server\services\batchfolder\manjjUserInfraUserInfrau620.txt
      