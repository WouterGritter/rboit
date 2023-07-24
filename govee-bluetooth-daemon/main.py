import dataclasses
import logging
import math
import os
from dataclasses import dataclass
from time import time

from dotenv import load_dotenv
from flask import Flask
from bleson import get_provider, Observer

load_dotenv()

log = logging.getLogger('werkzeug')
log.setLevel(logging.ERROR)


@dataclass
class Reading:
    epochTime: int  # Epoch time (ms)
    address: str  # Bluetooth mac address
    name: str  # Device name
    temperature: float  # Temperature (degrees celsius)
    humidity: float  # Humidity (percentage 0-100)
    battery: int  # Battery (percentage 0-100)


last_readings: {str: Reading} = {}


def data_callback(address: str, name: str, temperature: float, humidity: float, battery: int):
    if address not in last_readings:
        print(f'First time reading a packet from {name} ({address})')

    reading = Reading(
        math.floor(time() * 1000),
        address,
        name,
        temperature,
        humidity,
        battery
    )

    last_readings[address] = reading


def on_advertisement(advertisement):
    mfg_data = advertisement.mfg_data
    address = advertisement.address.address
    name = advertisement.name

    if mfg_data is not None and name is not None:
        if name.startswith('GVH5075'):
            values = int.from_bytes(mfg_data[3:6], 'big')
            temp = float(values / 10000)
            hum = float((values % 1000) / 10)
            bat = mfg_data[6]
            data_callback(address, name, temp, hum, bat)

        # Other models might use this format:
        # values = int.from_bytes(mfg_data[4:7], 'big')
        # temp = float(values / 10000)
        # hum = float((values % 1000) / 10)
        # bat = mfg_data[7]
        # data_callback(address, name, temp, hum, bat)


print('Hello, world')

adapter = get_provider().get_adapter()

observer = Observer(adapter)
observer.on_advertising_data = on_advertisement

observer.start()

app = Flask(__name__)


@app.route('/')
def route__get_addresses():
    return list(last_readings.keys())


@app.route('/all')
def route__all():
    return last_readings


@app.route('/<address>')
def route__get_reading(address):
    if address not in last_readings:
        return {}

    return dataclasses.asdict(last_readings[address])


if __name__ == '__main__':
    port = os.getenv('PORT') or '80'
    print(f'Starting flask server on 0.0.0.0:{port}')

    app.run(host='0.0.0.0', port=port, debug=False)
