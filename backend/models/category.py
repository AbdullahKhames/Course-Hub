#!/usr/bin/python3
""" holds class Category"""

from models.base_model import BaseModel, Base
from sqlalchemy import Column, String, ForeignKey
from sqlalchemy.orm import relationship
import models

class Category(BaseModel, Base):
    """Reapresntation of Category class"""
    __tablename__ = 'categories'
    name = Column(String(128), nullable=False)
    courses = relationship('Course', backref='Category')
    students = relationship('models.student.Student', back_populates='category')

    def __init__(self, *args, **kwargs):
        """initializes Category"""
        super().__init__(*args, **kwargs)

    def to_dict(self):
        """return dict representation of Category"""
        from models import storage
        new_dict = super().to_dict()
        new_dict['courses'] = [course.to_dict() for course in self.courses]
        # new_dict['students'] = [student.to_dict() for student in self.students]
        return new_dict
