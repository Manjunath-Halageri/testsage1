@echo off

          @FOR /f "tokens=*" %%i IN ('docker-machine env manjjUserInfra ') DO @%%i

          docker ps --filter "name=zapDocker_2" >> BREAK > E:\zap\backend\server\services\batchfolder\manjjUserInfraUserInfrau619.txt
            