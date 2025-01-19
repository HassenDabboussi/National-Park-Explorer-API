from flask.views import MethodView
from flask_smorest import Blueprint, abort
from sqlalchemy.exc import SQLAlchemyError, IntegrityError
from schemas import FaunaSchema
from models import FaunaModel
from db import db
from middleware import jwt_required


# Blueprint for fauna routes
blp = Blueprint("Fauna", __name__, description="Operations on Fauna")

@blp.route("/fauna")
class FaunaList(MethodView):
    @jwt_required()
    @blp.response(200, FaunaSchema(many=True))
    def get(self):
        """Retrieve a list of all fauna."""
        try:
            fauna = FaunaModel.query.all()
            return fauna
        except SQLAlchemyError as e:
            abort(500, message=f"An error occurred while fetching fauna: {str(e)}")


    @jwt_required(required_role="admin")
    @blp.arguments(FaunaSchema)
    @blp.response(201, FaunaSchema)
    def post(self, fauna_data):
        """Add new fauna."""
        try:
            fauna = FaunaModel(**fauna_data)
            db.session.add(fauna)
            db.session.commit()
            return fauna
        except IntegrityError:
            abort(400, message="Fauna with the same name already exists.")
        except SQLAlchemyError as e:
            abort(500, message=f"An error occurred while adding the fauna: {str(e)}")

@blp.route("/fauna/<int:fauna_id>")
class Fauna(MethodView):
    @jwt_required()
    @blp.response(200, FaunaSchema)
    def get(self, fauna_id):
        """Retrieve details of specific fauna."""
        try:
            fauna = FaunaModel.query.get_or_404(fauna_id)
            return fauna
        except SQLAlchemyError as e:
            abort(500, message=f"An error occurred while fetching the fauna: {str(e)}")

    
    @jwt_required(required_role="admin")
    @blp.arguments(FaunaSchema)
    @blp.response(200, FaunaSchema)
    def put(self, fauna_data, fauna_id):
        """Update fauna's details."""
        try:
            fauna = FaunaModel.query.get_or_404(fauna_id)
            for key, value in fauna_data.items():
                setattr(fauna, key, value)
            db.session.commit()
            return fauna
        except IntegrityError:
            abort(400, message="Fauna with the same name already exists.")
        except SQLAlchemyError as e:
            abort(500, message=f"An error occurred while updating the fauna: {str(e)}")


    @jwt_required(required_role="admin")
    @blp.response(204)
    def delete(self, fauna_id):
        """Delete fauna."""
        try:
            fauna = FaunaModel.query.get_or_404(fauna_id)
            db.session.delete(fauna)
            db.session.commit()
            return {"message": "Fauna deleted successfully."}
        except SQLAlchemyError as e:
            abort(500, message=f"An error occurred while deleting the fauna: {str(e)}")
