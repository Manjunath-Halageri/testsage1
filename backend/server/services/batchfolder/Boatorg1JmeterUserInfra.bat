@echo off

    @FOR /f "tokens=*" %%i IN ('docker-machine env Boatorg1JmeterUserInfra ') DO @%%i

    docker exec chrome_1 rm -rf /home/seluser/Downloads/sID882.jmx