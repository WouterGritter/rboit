from datetime import datetime

import requests

HOST = 'https://rboit.woutergritter.me'


def load_all_devices():
    print('Loading device list...', end='')
    result = {}
    names = requests.get(f'{HOST}/api/device/power/names').json()
    counter = 0
    for name in names:
        counter += 1
        print(f'\rLoading device ({counter}/{len(names)}) {name}...', end='')
        energy = __get_energy(name)
        result[name] = energy

    print('\rDone loading devices!')
    return result


def __get_energy(device_name):
    history = requests.get(f'{HOST}/api/device/power/history/{device_name}').json()
    last_entry = None
    total_watt_hours = 0
    for entry in history:
        if last_entry is None:
            last_entry = entry
            continue

        if 'power' not in last_entry or 'power' not in entry:
            continue

        last_date = datetime.fromisoformat(last_entry['date'])
        date = datetime.fromisoformat(entry['date'])
        date_diff = (date - last_date).total_seconds()

        last_power = last_entry['power']
        power = entry['power']
        avg_power = (last_power + power) / 2

        watt_seconds = date_diff * avg_power
        watt_hours = watt_seconds / 60 / 60
        total_watt_hours += watt_hours

        last_entry = entry

    return total_watt_hours / 1000


def print_energy(device_name, energy):
    avg_watts = energy / 24 * 1000
    cost = energy * 0.67

    name_padding = " " * (30 - len(device_name))
    print(f'{device_name}:{name_padding}{energy:6.3f} kWh / {avg_watts:5.1f} W / {cost:5.2f} EUR')


def main():
    device_energy = load_all_devices()

    total_energy_metered = device_energy['rb-smart-meter']
    total_energy_usage = total_energy_metered + abs(device_energy['rb-solar'])

    print_energy('TOTAL METERED', total_energy_metered)
    print_energy('TOTAL USED', total_energy_usage)
    print_energy('TOTAL USED (w/o heat)',
                 total_energy_usage - device_energy['rb-ac'] - device_energy['rb-kachel-slaapkamer'])
    print_energy('TOTAL USED (w/o heat & boiler)',
                 total_energy_usage - device_energy['rb-ac'] - device_energy['rb-kachel-slaapkamer'] - device_energy['rb-boiler'])
    print_energy('TOTAL USED (heat)', device_energy['rb-ac'] + device_energy['rb-kachel-slaapkamer'])
    print_energy('TOTAL USED (heat & boiler)', device_energy['rb-ac'] + device_energy['rb-kachel-slaapkamer'] + device_energy['rb-boiler'])

    print()

    devices = [
        'rb-solar',
        'rb-boiler',
        'hue-devices',
        'rb-ac',
        'rb-tv',
        'rb-kachel-slaapkamer',
        'rb-slaapkamer-bureau',
    ]

    cumulative_device_energy = 0
    for device_name in devices:
        energy = device_energy[device_name]
        cumulative_device_energy += energy
        print_energy(device_name, energy)

    # Known stand-by usage
    standby_energy = 52 / 1000 * 24
    cumulative_device_energy += standby_energy
    print_energy('est. stand-by', standby_energy)

    remaining_rb = total_energy_usage - cumulative_device_energy
    print_energy('remaining', remaining_rb)

    percentage_from_solar = abs(device_energy['rb-solar']) / total_energy_usage * 100
    print()
    print(f'Solar generated {percentage_from_solar:.2f}% of the used energy today.')


if __name__ == '__main__':
    main()
