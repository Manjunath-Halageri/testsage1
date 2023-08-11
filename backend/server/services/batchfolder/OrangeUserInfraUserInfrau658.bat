@echo off

        @FOR /f "tokens=*" %%i IN ('docker-machine env OrangeUserInfra ') DO @%%i

        docker stop hub_2 chrome_2
      