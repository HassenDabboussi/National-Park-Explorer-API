from flask.views import MethodView
from flask_smorest import Blueprint, abort
from sqlalchemy.exc import SQLAlchemyError, IntegrityError
from schemas import ParkSchema, ActivitySchema, FaunaSchema, FloraSchema
from models import ParkModel, FloraModel, FaunaModel, ActivityModel
from models.park import park_fauna, park_flora, park_activities
from db import db
from middleware import jwt_required


blp = Blueprint("Parks", __name__, description="Operations on Parks")

@blp.route("/parks")
class ParkList(MethodView):
    @jwt_required()
    @blp.response(200, ParkSchema(many=True))
    def get(self):
        try:
            parks = ParkModel.query.all()
            return parks
        except SQLAlchemyError as e:
            abort(500, message=f"An error occurred while fetching parks: {str(e)}")


    @jwt_required(required_role="admin")
    @blp.arguments(ParkSchema)
    @blp.response(201, ParkSchema)
    def post(self, park_data):
        try:
            park = ParkModel(**park_data)
            db.session.add(park)
            db.session.commit()
            return park
        except IntegrityError:
            abort(400, message="A park with the same name already exists.")
        except SQLAlchemyError as e:
            abort(500, message=f"An error occurred while adding the park: {str(e)}")

@blp.route("/parks/<int:park_id>")
class Park(MethodView):
    @jwt_required()
    @blp.response(200, ParkSchema)
    def get(self, park_id):
        try:
            park = ParkModel.query.get_or_404(park_id)
            return park
        except SQLAlchemyError as e:
            abort(500, message=f"An error occurred while fetching the park: {str(e)}")


    @jwt_required(required_role="admin")
    @blp.arguments(ParkSchema)
    @blp.response(200, ParkSchema)
    def put(self, park_data, park_id):
        try:
            park = ParkModel.query.get_or_404(park_id)
            for key, value in park_data.items():
                setattr(park, key, value)
            db.session.commit()
            return park
        except IntegrityError:
            abort(400, message="A park with the same name already exists.")
        except SQLAlchemyError as e:
            abort(500, message=f"An error occurred while updating the park: {str(e)}")


    @jwt_required(required_role="admin")
    @blp.response(204)
    def delete(self, park_id):
        try:
            park = ParkModel.query.get_or_404(park_id)
            db.session.delete(park)
            db.session.commit()
            return {"message": "Park deleted successfully."}
        except SQLAlchemyError as e:
            abort(500, message=f"An error occurred while deleting the park: {str(e)}")


@blp.route("/parks/<int:park_id>/flora")
class ParkFlora(MethodView):
    @jwt_required()
    @blp.response(200, FloraSchema(many=True))
    def get(self, park_id):
        try:
            # Query flora using the association table
            flora = (
                db.session.query(FloraModel)
                .join(park_flora, FloraModel.id == park_flora.c.flora_id)
                .filter(park_flora.c.park_id == park_id)
                .all()
            )
            return flora
        except SQLAlchemyError as e:
            abort(500, description=f"An error occurred while fetching flora: {str(e)}")




@blp.route("/parks/<int:park_id>/fauna")
class ParkFauna(MethodView):
    @jwt_required()
    @blp.response(200, FaunaSchema(many=True))
    def get(self, park_id):
        try:
            # Query fauna using the association table
            fauna = (
                db.session.query(FaunaModel)
                .join(park_fauna, FaunaModel.id == park_fauna.c.fauna_id)
                .filter(park_fauna.c.park_id == park_id)
                .all()
            )
            return fauna
        except SQLAlchemyError as e:
            abort(500, description=f"An error occurred while fetching fauna: {str(e)}")




@blp.route("/parks/<int:park_id>/activities")
class ParkActivities(MethodView):
    @jwt_required()
    @blp.response(200, ActivitySchema(many=True))
    def get(self, park_id):
        try:
            # Query activities using the association table
            activities = (
                db.session.query(ActivityModel)
                .join(park_activities, ActivityModel.id == park_activities.c.activity_id)
                .filter(park_activities.c.park_id == park_id)
                .all()
            )
            return activities
        except SQLAlchemyError as e:
            abort(500, description=f"An error occurred while fetching activities: {str(e)}")
