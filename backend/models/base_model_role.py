#!/usr/bin/python3
"""
Contains class BaseModel
"""

from models.base import BaseMethods


class BaseRole(BaseMethods):
    """The BaseModel class from which future classes will be derived"""

    def __init__(self, *args, **kwargs):
        """Initialization of the base model"""
        if kwargs:
            for key, value in kwargs.items():
                if key != "__class__":
                    setattr(self, key, value)
