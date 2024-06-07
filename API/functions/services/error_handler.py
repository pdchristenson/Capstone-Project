import logging
from fastapi import HTTPException
from interfaces.customexception import CustomException

class ErrorHandler():
    """
    Custom error handler.
    """
    def __init__(self):
        logging.basicConfig(level=logging.ERROR, format='%(asctime)s - %(levelname)s - %(message)s')

    @staticmethod
    def handle_exception(e: CustomException):
        logging.error(f"{e.class_name} - {e.get_colored_message()}")
        raise HTTPException(status_code=e.status_code, detail=e.message)
    
    @staticmethod
    def test_object_instantiation() -> int:
        return 1
    

    