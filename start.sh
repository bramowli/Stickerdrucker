#/bin/bash

firefox --kiosk http://localhost:8000/startdisplay.html
python -m http.server 8000
