from http import HTTPStatus
from config.ansi_colors import COLORS
from interfaces.customexception import CustomException

class EnvironmentVariableNotFoundError(CustomException):
    """
    Custom exception for missing environment variables.
    """
    def __init__(self, class_name: str, variable_name:str):
        self.variable_name = variable_name
        self.class_name = class_name
        self.color = "red"
        self.status_code = HTTPStatus.SERVICE_UNAVAILABLE.value
        self.message = f"Environment variable '{self.variable_name}' not found"
        super().__init__(self.status_code, self.class_name, self.color, self.message)
    
class RequiredParameterError(CustomException):
    """
    Custom exception for missing required parameters.
    """
    def __init__(self, class_name: str, parameter_name: str):
        self.parameter_name = parameter_name
        self.class_name = class_name
        self.color = "cyan"
        self.status_code = HTTPStatus.BAD_REQUEST.value
        self.message = f"Required parameter '{self.parameter_name}' was null"
        super().__init__(status_code=self.status_code, class_name=self.class_name, color=self.color, message=self.message)
    
class UnsupportedFacilityError(CustomException):
    """
    Custom exception for unsupported facility types.
    """
    def __init__(self, class_name: str, facility_type: str):
        self.facility_type = facility_type
        self.class_name = class_name
        self.color = "orange"
        self.status_code = HTTPStatus.BAD_REQUEST.value
        self.message = f"Facility type '{self.facility_type}' is not supported"
        super().__init__(self.status_code, self.class_name, self.color, self.message)

class InternalServiceBadReturnError(CustomException):
    """
    Custom exception for internal services returning bad values (null, 0, etc.).
    """
    def __init__(self, class_name: str, method_name: str):
        self.method_name = method_name
        self.class_name = class_name
        self.color = "red"
        self.status_code = HTTPStatus.INTERNAL_SERVER_ERROR.value
        self.message = f"Internal method '{self.method_name}' returned null"
        super().__init__(self.status_code, self.class_name, self.color, self.message)

class InternalServiceFailed(CustomException):
    """
    Custom exception for internal services failing.
    """
    def __init__(self, class_name: str, method_name: str):
        self.method_name = method_name
        self.class_name = class_name
        self.color = "red"
        self.status_code = HTTPStatus.INTERNAL_SERVER_ERROR.value
        self.message = f"Internal method '{self.method_name}' failed"
        super().__init__(self.status_code, self.class_name, self.color, self.message)

class ExternalServiceFailed(CustomException):
    """
    Custom exception for external services failing to return the correct data.
    """
    def __init__(self, class_name: str, method_name: str):
        self.method_name = method_name
        self.class_name = class_name
        self.color = "red"
        self.status_code = HTTPStatus.REQUEST_TIMEOUT.value
        self.message = f"External service '{self.method_name}' failed"
        super().__init__(self.status_code, self.class_name, self.color, self.message)

class ExternalServiceConnectionFailedError(CustomException):
    """
    Custom exception for external services failing to connect.
    """
    def __init__(self, class_name: str):
        self.class_name = class_name
        self.color = "red"
        self.status_code = HTTPStatus.SERVICE_UNAVAILABLE.value
        self.message = f"External service '{self.method_name}' failed to initialize"
        super().__init__(self.status_code, self.class_name, self.color, self.message)

class InternalServiceConnectionFailedError(CustomException):
    """
    Custom exception for internal services failing to connect.
    """
    def __init__(self, class_name: str):
        self.class_name = class_name
        self.color = "red"
        self.status_code = HTTPStatus.INTERNAL_SERVER_ERROR.value
        self.message = f"Internal service '{self.method_name}' failed to initialize"
        super().__init__(self.status_code, self.class_name, self.color, self.message)