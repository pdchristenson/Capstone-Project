from abc import ABC, abstractmethod
from config.ansi_colors import COLORS

class CustomException(Exception, ABC):
    """
    Custom exception for handling errors.
    """
    def __init__(self, status_code: int, class_name: str, color: str = "yellow", message: str = "This a default error message, as a custom one was not created"):
        self.status_code = status_code
        self.class_name = class_name
        self.color = color
        self.message = message
        super().__init__(self.message)
    
    def get_colored_message(self):
        return f"{COLORS[self.color]}{self.message}{COLORS['reset']}"