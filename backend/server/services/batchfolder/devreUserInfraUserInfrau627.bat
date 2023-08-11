@echo off

          @FOR /f "tokens=*" %%i IN ('docker-machine env devreUserInfra ') DO @%%i

          docker ps --filter "name=chrome_1" >> BREAK > C:\Users\Dell\Desktop\testSage\testsage\backend\server\services\batchfolder\devreUserInfraUserInfrau627.txt
            