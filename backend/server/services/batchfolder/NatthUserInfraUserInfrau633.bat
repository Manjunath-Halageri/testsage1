@echo off

    @FOR /f "tokens=*" %%i IN ('docker-machine env NatthUserInfra ') DO @%%i

    docker ps --filter "name=chrome_1" >> BREAK > E:\zap\backend\server\services\batchfolder\NatthUserInfraUserInfrau633.txt
      