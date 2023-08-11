@echo off

          @FOR /f "tokens=*" %%i IN ('docker-machine env owaspzap1UserInfra ') DO @%%i

          docker ps --filter "name=zapDocker_1" >> BREAK > E:\zap\backend\server\services\batchfolder\owaspzap1UserInfraUserInfrau639.txt
            