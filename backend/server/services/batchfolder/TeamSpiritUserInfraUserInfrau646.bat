@echo off

        @FOR /f "tokens=*" %%i IN ('docker-machine env TeamSpiritUserInfra ') DO @%%i

        docker stop hub_1 chrome_1
      