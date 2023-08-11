@echo off

          @FOR /f "tokens=*" %%i IN ('docker-machine env koliUserInfra ') DO @%%i

          docker ps --filter "name=zapDocker_2" >> BREAK > E:\zap\backend\server\services\batchfolder\koliUserInfraUserInfrau616.txt
            