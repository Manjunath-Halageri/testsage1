@echo off

        @FOR /f "tokens=*" %%i IN ('docker-machine env reportUserInfra ') DO @%%i

        docker stop hub_2 chrome_2
      