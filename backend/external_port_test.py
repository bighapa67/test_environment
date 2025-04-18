
'''
The purpose of this file is to create a "consumer" on a particular port.
This is necessary to test whether or not a port opened via Spectrum (or probably any other router/service) is actually accessible
remotely.
It turns out that, if no consumer is actively listening on the port, then services such as "canyouseeme.org" will report that the port
is closed even though the port forwarding set up via the Spectrum app is working correctly.
'''

from app import create_app

app = create_app()

if __name__ == '__main__':
    # Runs the app on all available network interfaces (0.0.0.0)
    # on port 5000, enabling external access for testing.
    print("Starting Flask server for external access testing on http://0.0.0.0:5000")
    app.run(host='0.0.0.0', port=5000, debug=False) # Debug set to False for this test 