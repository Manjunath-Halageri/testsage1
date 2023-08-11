@echo off

                    @FOR /f "tokens=*" %%i IN ('docker-machine env AplhaJmeterExecutionInfra') DO @%%i
                    docker inspect -f '{{range.NetworkSettings.Networks}}{{.IPAddress}}{{end}}' slave_1 >> BREAK > C:\testsage\backend\server\services\jmeterContainerStart.txt