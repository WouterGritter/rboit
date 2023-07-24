import logging
import os

import minimalmodbus
from dotenv import load_dotenv
from flask import Flask

load_dotenv()

log = logging.getLogger('werkzeug')
log.setLevel(logging.ERROR)

app = Flask(__name__)

DTS353F_USB_DEVICE = os.getenv('DTS353F_USB_DEVICE')

print(f'{DTS353F_USB_DEVICE=}')

rs485 = minimalmodbus.Instrument(DTS353F_USB_DEVICE, 1)
rs485.serial.baudrate = 9600
rs485.serial.bytesize = 8
rs485.serial.parity = minimalmodbus.serial.PARITY_EVEN
rs485.serial.stopbits = 1
rs485.serial.timeout = 0.5
rs485.debug = False
rs485.mode = minimalmodbus.MODE_RTU


def retry(action, max_tries=4):
    n = 0
    while True:
        try:
            return action()
        except Exception as ex:
            n += 1
            if n == max_tries:
                raise ex


def dts353f_read_energy():
    delivery = retry(lambda: rs485.read_float(0x0108))
    redelivery = retry(lambda: rs485.read_float(0x0110))
    total = delivery - redelivery

    return {
        'delivery': delivery,
        'redelivery': redelivery,
        'total': total,
    }


def dts353f_read_power():
    total_power = retry(lambda: rs485.read_float(0x001C))

    l1_power = retry(lambda: rs485.read_float(0x001E))
    l2_power = retry(lambda: rs485.read_float(0x0020))
    l3_power = retry(lambda: rs485.read_float(0x0022))

    l1_voltage = retry(lambda: rs485.read_float(0x000E))
    l2_voltage = retry(lambda: rs485.read_float(0x0010))
    l3_voltage = retry(lambda: rs485.read_float(0x0012))

    return {
        'total_power': total_power,
        'l1_power': l1_power,
        'l2_power': l2_power,
        'l3_power': l3_power,
        'l1_voltage': l1_voltage,
        'l2_voltage': l2_voltage,
        'l3_voltage': l3_voltage,
    }


@app.route('/')
def get_dts353f_energy_and_power_endpoint():
    return {
        'energy': dts353f_read_energy(),
        'power': dts353f_read_power(),
    }


@app.route('/energy')
def get_dts353f_energy_endpoint():
    return dts353f_read_energy()


@app.route('/power')
def get_dts353f_power_endpoint():
    return dts353f_read_power()


if __name__ == '__main__':
    port = os.getenv('PORT') or '80'
    print(f'Starting flask server on 0.0.0.0:{port}')

    app.run(host='0.0.0.0', port=port, debug=False)
