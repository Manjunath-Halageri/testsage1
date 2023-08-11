@echo off

          @FOR /f "tokens=*" %%i IN ('docker-machine env testsageUserInfra ') DO @%%i

          docker ps --filter "name=chrome_1" >> BREAK > C:\Users\Dell\Documents\testsageproject\testsage\backend\server\services\batchfolder\testsageUserInfraUserInfrau616.txt
            