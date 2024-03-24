#!/usr/bin/python3

from sqlalchemy import Column, Integer, String
from sqlalchemy import ForeignKey
from sqlalchemy.orm import relationship
from models.base_model import Base
from models.base_model_role import BaseRole
from models.user import User


class Instructor(BaseRole, Base):
    """Reapresntation for Instructor"""
    __tablename__ = 'instructors'

    total_students =  Column(Integer, nullable=False, default=0)
    user = relationship("User", backref="instructor")
    id = Column(String(60), ForeignKey('users.id'), primary_key=True)
    courses = relationship('Course', backref='instructor')
    
    def __init__(self, *args, **kwargs):
        """initializes user"""
        super().__init__(*args, **kwargs)

    def to_dict(self):
        """return dict representation of instructor"""
        from models import storage
        new_dict = super().to_dict()
        user_dict = self.user.to_dict()
        new_dict.update(user_dict)
        new_dict['courses'] = [course.to_dict() for course in self.courses]
        new_dict['total_students'] = self.total_students

        return new_dict
