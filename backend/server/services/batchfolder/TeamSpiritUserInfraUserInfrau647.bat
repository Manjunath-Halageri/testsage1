@echo off

          @FOR /f "tokens=*" %%i IN ('docker-machine env TeamSpiritUserInfra ') DO @%%i

          docker ps --filter "name=chrome_1" >> BREAK > C:\testsage\backend\server\services\batchfolder\TeamSpiritUserInfraUserInfrau647.txt
            