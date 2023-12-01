FROM python:3.11-slim-buster

WORKDIR /app

COPY requirements.txt requirements.txt

RUN pip3 install -r requirements.txt

# (Hopefully temporary) fix for new Tapo firmware
# More info: https://github.com/fishbigger/TapoP100/issues/134
# Working fork: https://github.com/almottier/TapoP100
# Original repository: https://github.com/fishbigger/TapoP100
RUN pip install --force-reinstall git+https://github.com/almottier/TapoP100.git@main

COPY *.py ./
CMD [ "python3", "-u", "main.py" ]
