from flask import Flask
from flask_smorest import Api
from flask_cors import CORS
from db import db
from resources.park import blp as ParkBlueprint
from resources.flora import blp as FloraBlueprint
from resources.fauna import blp as FaunaBlueprint
from resources.activity import blp as ActivityBlueprint
from resources.user import blp as UserBlueprint
import os
from dotenv import load_dotenv

load_dotenv()


def create_app():
    app = Flask(__name__)
    CORS(app)
    # Configuration
    app.config["PROPAGATE_EXCEPTIONS"] = True
    app.config["API_TITLE"] = "National Parks API"
    app.config["API_VERSION"] = "v1"
    app.config["OPENAPI_VERSION"] = "3.0.3"
    app.config["OPENAPI_URL_PREFIX"] = "/"  
    app.config["OPENAPI_SWAGGER_UI_PATH"] = "/swagger-ui"
    app.config["OPENAPI_SWAGGER_UI_URL"] = "https://cdn.jsdelivr.net/npm/swagger-ui-dist/"
    app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv("SQLALCHEMY_DATABASE_URI")
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

    # Initialize extensions
    db.init_app(app)
    api = Api(app)

    # Register blueprints
    api.register_blueprint(ParkBlueprint)
    api.register_blueprint(FloraBlueprint)
    api.register_blueprint(FaunaBlueprint)
    api.register_blueprint(ActivityBlueprint)
    api.register_blueprint(UserBlueprint)

    return app

if __name__ == "__main__":
    app = create_app()
    with app.app_context():
        db.create_all() 

    app.run(port=5000, debug=True)
