from flask.views import MethodView
from flask_smorest import Blueprint, abort
from sqlalchemy.exc import SQLAlchemyError, IntegrityError
from schemas import FloraSchema
from models import FloraModel
from db import db
from middleware import jwt_required


# Blueprint for flora routes
blp = Blueprint("Flora", __name__, description="Operations on Flora")

@blp.route("/flora")
class FloraList(MethodView):
    @jwt_required()
    @blp.response(200, FloraSchema(many=True))
    def get(self):
        """Retrieve a list of all flora."""
        try:
            flora = FloraModel.query.all()
            return flora
        except SQLAlchemyError as e:
            abort(500, message=f"An error occurred while fetching flora: {str(e)}")


    @jwt_required(required_role="admin")
    @blp.arguments(FloraSchema)
    @blp.response(201, FloraSchema)
    def post(self, flora_data):
        """Add new flora."""
        try:
            flora = FloraModel(**flora_data)
            db.session.add(flora)
            db.session.commit()
            return flora
        except IntegrityError:
            abort(400, message="Flora with the same name already exists.")
        except SQLAlchemyError as e:
            abort(500, message=f"An error occurred while adding the flora: {str(e)}")

@blp.route("/flora/<int:flora_id>")
class Flora(MethodView):
    @jwt_required()
    @blp.response(200, FloraSchema)
    def get(self, flora_id):
        """Retrieve details of specific flora."""
        try:
            flora = FloraModel.query.get_or_404(flora_id)
            return flora
        except SQLAlchemyError as e:
            abort(500, message=f"An error occurred while fetching the flora: {str(e)}")


    @jwt_required(required_role="admin")
    @blp.arguments(FloraSchema)
    @blp.response(200, FloraSchema)
    def put(self, flora_data, flora_id):
        """Update flora's details."""
        try:
            flora = FloraModel.query.get_or_404(flora_id)
            for key, value in flora_data.items():
                setattr(flora, key, value)
            db.session.commit()
            return flora
        except IntegrityError:
            abort(400, message="Flora with the same name already exists.")
        except SQLAlchemyError as e:
            abort(500, message=f"An error occurred while updating the flora: {str(e)}")


    @jwt_required(required_role="admin")
    @blp.response(204)
    def delete(self, flora_id):
        """Delete flora."""
        try:
            flora = FloraModel.query.get_or_404(flora_id)
            db.session.delete(flora)
            db.session.commit()
            return {"message": "Flora deleted successfully."}
        except SQLAlchemyError as e:
            abort(500, message=f"An error occurred while deleting the flora: {str(e)}")
