from marshmallow import INCLUDE, Schema, fields, validates, ValidationError, post_load, validates_schema

from models import storage
from models.user import User


class SignUpSchema(Schema):
    class Meta:
        unknown = INCLUDE
    email = fields.Email(required=True)
    name = fields.String(required=True)
    password = fields.String(required=True)
    confirmPassword = fields.String(required=True)
    role = fields.Integer(required=True)
    age = fields.Integer()

    @post_load
    def make_user(self, data, **kwargs):
        return User(**data)

    @validates('email')
    def validate_email(self, value):
        if storage.getUserByEmail(value):
            raise ValidationError("email already exists")
        
    @validates('role')
    def validate_rolel(self, value):
        if value not in [0, 1, 2]:
            raise ValidationError("role doesnt exist")

    @validates('name')
    def validate_name(self, value):
        if len(value) < 2:
            raise ValidationError("Name cannot be less than 2 characters")

    @validates('password')
    def validate_password(self, value):
        if len(value) < 6:
            raise ValidationError("Password cannot be less than 6 characters")

    @validates('age')
    def validate_age(self, value):
        if value and value < 9:
            raise ValidationError("Age cannot be less than 9")
        
    @validates_schema
    def validate_confirm_password(self, data, **kwargs):
        if data.get('confirmPassword') != data.get('password'):
            raise ValidationError('Passwords do not match.')

class SignInSchema(Schema):
    class Meta:
        unknown = INCLUDE
    email = fields.Email(required=True)
    password = fields.String(required=True)


class ActivationSchema(Schema):
    class Meta:
        unknown = INCLUDE
    email = fields.Email(required=True)
    activation_token = fields.String(required=True)
