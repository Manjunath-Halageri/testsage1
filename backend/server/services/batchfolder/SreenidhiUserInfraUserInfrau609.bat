@echo off

          @FOR /f "tokens=*" %%i IN ('docker-machine env SreenidhiUserInfra ') DO @%%i

          docker ps --filter "name=chrome_1" >> BREAK > C:\Users\Dell\Documents\testsageproject\testsage\backend\server\services\batchfolder\SreenidhiUserInfraUserInfrau609.txt
            