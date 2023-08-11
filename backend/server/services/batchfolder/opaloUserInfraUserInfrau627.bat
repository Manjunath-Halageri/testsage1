@echo off

          @FOR /f "tokens=*" %%i IN ('docker-machine env opaloUserInfra ') DO @%%i

          docker ps --filter "name=zapDocker_1" >> BREAK > E:\zap\backend\server\services\batchfolder\opaloUserInfraUserInfrau627.txt
            