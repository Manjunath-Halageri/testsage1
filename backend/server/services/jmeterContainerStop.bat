@echo off

                  @FOR /f "tokens=*" %%i IN ('docker-machine env AplhaJmeterExecutionInfra') DO @%%i

                  docker stop slave_2