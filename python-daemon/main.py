import logging
import os

from dotenv import load_dotenv
from flask import Flask

from goodwe import get_goodwe_device
from tapo import get_tapo_device

load_dotenv()

log = logging.getLogger('werkzeug')
log.setLevel(logging.ERROR)

app = Flask(__name__)


@app.route('/tapo/<address>')
def get_tapo_device_endpoint(address):
    device = get_tapo_device(address)
    return device.getEnergyUsage()


@app.route('/goodwe/<system_id>')
def get_goodwe_device_endpoint(system_id):
    device = get_goodwe_device(system_id)
    device.getCurrentReadings()
    return device.data


if __name__ == '__main__':
    port = os.getenv('PORT') or '80'
    print(f'Starting flask server on 0.0.0.0:{port}')

    app.run(host='0.0.0.0', port=port, debug=False)
