@echo off

          @FOR /f "tokens=*" %%i IN ('docker-machine env koliUserInfra ') DO @%%i

          docker ps --filter "name=zapDocker_1" >> BREAK > E:\testsage\testsage\backend\server\services\batchfolder\koliUserInfraUserInfrau614.txt
            