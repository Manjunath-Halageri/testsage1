@echo off

          @FOR /f "tokens=*" %%i IN ('docker-machine env smileUserInfra ') DO @%%i

          docker ps --filter "name=zapDocker_1" >> BREAK > E:\zap\backend\server\services\batchfolder\smileUserInfraUserInfrau630.txt
            