#!/usr/bin/python3

from sqlalchemy import Column, Integer, ForeignKey, String
from sqlalchemy.orm import relationship
from models.category import Category
from models.base_model import BaseModel, Base
from models.base_model_role import BaseRole
from models.user import User


class Student(BaseRole, Base):
    """Reapresntation for Student"""
    __tablename__ = 'students'
    interested = Column(String(60), ForeignKey('categories.id'),
                        nullable=True)
    user = relationship("User", backref="student")
    category = relationship("Category", back_populates="students") # insterested category
    my_courses = relationship('Course', secondary='enrollments', viewonly=False, back_populates='students')
    id = Column(String(60), ForeignKey('users.id'), primary_key=True)

    def __init__(self, *args, **kwargs):
        """initializes user"""
        super().__init__(*args, **kwargs)

    def to_dict(self):
        """return dict representation of student"""
        from models import storage
        new_dict = super().to_dict()
        user_dict = self.user.to_dict()
        new_dict.update(user_dict)
        if self.category:
            new_dict['interested'] = self.category.to_dict()
        else:
            new_dict['interested'] = {'name': "Not Defined", 'id': '0'}
        new_dict['courses'] = [course.to_dict() for course in self.my_courses]
        if new_dict.get('user'):
            del new_dict['user']
        return new_dict
