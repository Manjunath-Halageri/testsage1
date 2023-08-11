@echo off

          @FOR /f "tokens=*" %%i IN ('docker-machine env manjunathUserInfra ') DO @%%i

          docker ps --filter "name=zapDocker_1" >> BREAK > E:\zap\backend\server\services\batchfolder\manjunathUserInfraUserInfrau636.txt
            