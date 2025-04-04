import os
from application import create_app

if __name__ == '__main__':
    port = int(os.environ.get("PORT", 8080))
    app = create_app()
    app.run(host='0.0.0.0', port=port, debug=True)