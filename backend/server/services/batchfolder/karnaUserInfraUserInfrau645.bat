@echo off

          @FOR /f "tokens=*" %%i IN ('docker-machine env karnaUserInfra ') DO @%%i

          docker ps --filter "name=zapDocker_1" >> BREAK > C:\Users\Dell\Desktop\testSage\testsage\backend\server\services\batchfolder\karnaUserInfraUserInfrau645.txt
            