#!/usr/bin/python3
"""service for enrollment"""

from models.enrollment import Enrollment

from utils import sess_manager

class EnrollmentService:
    """service for enrollment"""

    def __init__(self):
        """initialize enrollment service"""
        sess_manager.reload
        self.__session = sess_manager.session


    def get_enrollments(self, page, per_page):
        """method to paginate enrollments"""
        offset = (page - 1) * per_page

        results = self.__session.query(Enrollment)\
            .offset(offset)\
                .limit(per_page).all()
        return results

    def get_enrollments_by_course(self, course_id, page, per_page):
        """method to paginate enrollments"""
        offset = (page - 1) * per_page

        results = self.__session.query(Enrollment)\
            .filter(Enrollment.course_id == course_id)\
            .offset(offset)\
                .limit(per_page).all()
        return results

    def get_enrollments_by_student(self, student_id, page, per_page):
        """method to paginate enrollments"""
        offset = (page - 1) * per_page

        results = self.__session.query(Enrollment)\
            .filter(Enrollment.student_id == student_id)\
            .offset(offset)\
                .limit(per_page).all()
        return results

    def get_enrollment(self, course_id, student_id):
        """method to get enrollment by id"""
        return self.__session.query(Enrollment)\
            .filter(Enrollment.course_id == course_id)\
            .filter(Enrollment.student_id == student_id).first()

    def delete_enrollment(self, course_id, student_id):
        """method to delete enrollment by id"""
        enrollment = self.get_enrollment(course_id, student_id)
        if enrollment is not None:
            self.__session.delete(enrollment)
            self.__session.commit()
            return True
        else:
            return False

    def complete_enrollment(self, enrollment):
        """method to complete enrollment"""
        enrollment.completed = True
        self.__session.commit()
        return enrollment

    def uncomplete_enrollment(self, enrollment):
        """method to uncomplete enrollment"""
        enrollment.completed = False
        self.__session.commit()
        return enrollment

    def get_last_enrollment(self, course_id):
        """method to get last enrollment"""
        return self.__session.query(Enrollment)\
            .filter(Enrollment.course_id == course_id)\
            .order_by(Enrollment.enrolled_date.desc()).first()

