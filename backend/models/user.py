#!/usr/bin/python3
""" holds class User"""
from models.base_model import BaseModel, Base
from sqlalchemy import Column, String, Integer
from flask_login import UserMixin
from bcrypt import hashpw, gensalt


class User(BaseModel, Base, UserMixin):
    """Representation of a user """
    __tablename__ = 'users'
    email = Column(String(45), nullable=False, unique=True)
    password = Column(String(100), nullable=False)
    name = Column(String(150), nullable=True)
    age = Column(Integer(), nullable=True)
    role = Column(Integer, nullable=False) # 0 for admin, 1 for instructor, 2 for student

    def __init__(self, *args, **kwargs):
        """initializes user"""
        super().__init__(*args, **kwargs)

    def __setattr__(self, key: str, val) -> None:
        """The most important one
        Sets an attribute of this class to a given value"""
        if key == 'password':
            if type(val) is str and not is_bcrypt_hash(val):
                password = val.encode('utf-8')
                salt = gensalt()
                super().__setattr__(key, hashpw(password, salt))
            else:
                super().__setattr__(key, val)
        else:
            super().__setattr__(key, val)


def is_bcrypt_hash(hashed_password):
    """Check if the hashed password starts with the bcrypt identifier"""
    return hashed_password.startswith('$2b$')
