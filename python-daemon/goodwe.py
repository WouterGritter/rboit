import os

from dotenv import load_dotenv
from pygoodwe import SingleInverter

load_dotenv()

GOODWE_EMAIL = os.getenv('GOODWE_EMAIL')
GOODWE_PASSWORD = os.getenv('GOODWE_PASSWORD')

print(f'{GOODWE_EMAIL=}')

connected_devices = {}


def get_goodwe_device(system_id) -> SingleInverter:
    if system_id not in connected_devices:
        inverter = SingleInverter(
            system_id=system_id,
            account=GOODWE_EMAIL,
            password=GOODWE_PASSWORD,
        )

        connected_devices[system_id] = inverter

    return connected_devices[system_id]
