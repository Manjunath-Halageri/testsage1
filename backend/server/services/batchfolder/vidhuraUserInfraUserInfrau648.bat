@echo off

          @FOR /f "tokens=*" %%i IN ('docker-machine env vidhuraUserInfra ') DO @%%i

          docker ps --filter "name=zapDocker_1" >> BREAK > C:\Users\Dell\Desktop\testSage\testsage\backend\server\services\batchfolder\vidhuraUserInfraUserInfrau648.txt
            