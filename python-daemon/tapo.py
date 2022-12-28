import os

from PyP100.PyP110 import P110
from dotenv import load_dotenv

load_dotenv()

TP_LINK_EMAIL = os.getenv('TP_LINK_EMAIL')
TP_LINK_PASSWORD = os.getenv('TP_LINK_PASSWORD')

print(f'{TP_LINK_EMAIL=}')

connected_devices = {}


def get_tapo_device(ip) -> P110:
    if ip not in connected_devices or not is_connection_alive(connected_devices[ip]):
        if ip in connected_devices:
            print(f'Connection to {ip} lost!')
        print(f'Connecting to {ip}...')

        plug = P110(ip, TP_LINK_EMAIL, TP_LINK_PASSWORD)

        plug.handshake()
        plug.login()

        connected_devices[ip] = plug

        print(f'Successfully connected to {ip}!')

    # Check if the connection to the device is still alive

    return connected_devices[ip]


def is_connection_alive(device: P110) -> bool:
    try:
        device.getDeviceName()
        return True
    except:
        return False
