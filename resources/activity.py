from flask.views import MethodView
from flask_smorest import Blueprint, abort
from sqlalchemy.exc import SQLAlchemyError, IntegrityError
from schemas import ActivitySchema
from models import ActivityModel
from db import db
from middleware import jwt_required


# Blueprint for activity routes
blp = Blueprint("Activities", __name__, description="Operations on Activities")

@blp.route("/activities")
class ActivityList(MethodView):
    @jwt_required()
    @blp.response(200, ActivitySchema(many=True))
    def get(self):
        """Retrieve a list of all activities."""
        try:
            activities = ActivityModel.query.all()
            return activities
        except SQLAlchemyError as e:
            abort(500, message=f"An error occurred while fetching activities: {str(e)}")

    
    @jwt_required(required_role="admin")
    @blp.arguments(ActivitySchema)
    @blp.response(201, ActivitySchema)
    def post(self, activity_data):
        """Add new activity."""
        try:
            activity = ActivityModel(**activity_data)
            db.session.add(activity)
            db.session.commit()
            return activity
        except IntegrityError:
            abort(400, message="An activity with the same name already exists.")
        except SQLAlchemyError as e:
            abort(500, message=f"An error occurred while adding the activity: {str(e)}")

@blp.route("/activities/<int:activity_id>")
class Activity(MethodView):
    @jwt_required()
    @blp.response(200, ActivitySchema)
    def get(self, activity_id):
        """Retrieve details of specific activity."""
        try:
            activity = ActivityModel.query.get_or_404(activity_id)
            return activity
        except SQLAlchemyError as e:
            abort(500, message=f"An error occurred while fetching the activity: {str(e)}")


    @jwt_required(required_role="admin")
    @blp.arguments(ActivitySchema)
    @blp.response(200, ActivitySchema)
    def put(self, activity_data, activity_id):
        """Update activity's details."""
        try:
            activity = ActivityModel.query.get_or_404(activity_id)
            for key, value in activity_data.items():
                setattr(activity, key, value)
            db.session.commit()
            return activity
        except IntegrityError:
            abort(400, message="An activity with the same name already exists.")
        except SQLAlchemyError as e:
            abort(500, message=f"An error occurred while updating the activity: {str(e)}")
    
    
    @jwt_required(required_role="admin")
    @blp.response(204)
    def delete(self, activity_id):
        """Delete activity."""
        try:
            activity = ActivityModel.query.get_or_404(activity_id)
            db.session.delete(activity)
            db.session.commit()
            return {"message": "Activity deleted successfully."}
        except SQLAlchemyError as e:
            abort(500, message=f"An error occurred while deleting the activity: {str(e)}")
