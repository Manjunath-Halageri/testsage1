@echo off

    @FOR /f "tokens=*" %%i IN ('docker-machine env ammaUserInfra ') DO @%%i

    docker ps --filter "name=chrome_1" >> BREAK > E:\zap\backend\server\services\batchfolder\ammaUserInfraUserInfrau606.txt
      