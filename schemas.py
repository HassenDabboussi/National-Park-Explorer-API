from marshmallow import Schema, fields

# Plain Schemas (Basic, no nesting)
class PlainParkSchema(Schema):
    id = fields.Int(dump_only=True)
    name = fields.Str(required=True)
    location = fields.Str(required=True)
    size = fields.Str()
    description = fields.Str()
    image_url = fields.Str()

class PlainFloraSchema(Schema):
    id = fields.Int(dump_only=True)
    name = fields.Str(required=True)
    scientific_name = fields.Str()
    description = fields.Str()

class PlainFaunaSchema(Schema):
    id = fields.Int(dump_only=True)
    name = fields.Str(required=True)
    scientific_name = fields.Str()
    description = fields.Str()

class PlainActivitySchema(Schema):
    id = fields.Int(dump_only=True)
    name = fields.Str(required=True)
    difficulty = fields.Str()
    duration = fields.Str()
    description = fields.Str()

# Full Schemas (Include nested relationships)
class ParkSchema(PlainParkSchema):
    flora = fields.List(fields.Nested(PlainFloraSchema()), dump_only=True)
    fauna = fields.List(fields.Nested(PlainFaunaSchema()), dump_only=True)
    activities = fields.List(fields.Nested(PlainActivitySchema()), dump_only=True)

class FloraSchema(PlainFloraSchema):
    park = fields.Nested(PlainParkSchema(), dump_only=True)

class FaunaSchema(PlainFaunaSchema):
    park = fields.Nested(PlainParkSchema(), dump_only=True)

class ActivitySchema(PlainActivitySchema):
    park = fields.Nested(PlainParkSchema(), dump_only=True)

class UserSchema(Schema):
    id = fields.Int(dump_only=True) 
    username = fields.Str(required=True)  
    email = fields.Str(required=True)  
    password = fields.Str(load_only=True, required=True)  
    role = fields.Str(dump_only=True)  