"""Structured logging configuration"""
import logging
import logging.config
import json
from datetime import datetime
from pythonjsonlogger import jsonlogger
from app.config import get_settings


class CustomJsonFormatter(jsonlogger.JsonFormatter):
    """Custom JSON formatter with additional fields"""
    
    def add_fields(self, log_record, record, message_dict):
        super(CustomJsonFormatter, self).add_fields(log_record, record, message_dict)
        log_record['timestamp'] = datetime.utcnow().isoformat()
        log_record['level'] = record.levelname
        log_record['logger'] = record.name
        log_record['module'] = record.module
        log_record['function'] = record.funcName
        log_record['line'] = record.lineno


def setup_logging():
    """
    Setup structured logging configuration.
    
    Configures:
    - Console handler with JSON formatting
    - File handler for all logs
    - File handler for error logs
    - Appropriate log levels based on environment
    """
    settings = get_settings()
    
    log_level = logging.DEBUG if settings.DEBUG else logging.INFO
    
    logging_config = {
        "version": 1,
        "disable_existing_loggers": False,
        "formatters": {
            "json": {
                "()" : CustomJsonFormatter,
                "fmt": "%(timestamp)s %(level)s %(name)s %(message)s"
            },
            "standard": {
                "format": "%(asctime)s [%(levelname)s] %(name)s: %(message)s"
            },
        },
        "handlers": {
            "console": {
                "class": "logging.StreamHandler",
                "level": log_level,
                "formatter": "json",
                "stream": "ext://sys.stdout",
            },
            "file": {
                "class": "logging.handlers.RotatingFileHandler",
                "level": log_level,
                "formatter": "json",
                "filename": "logs/quissme.log",
                "maxBytes": 10485760,  # 10MB
                "backupCount": 10,
            },
            "error_file": {
                "class": "logging.handlers.RotatingFileHandler",
                "level": logging.ERROR,
                "formatter": "json",
                "filename": "logs/quissme_error.log",
                "maxBytes": 10485760,  # 10MB
                "backupCount": 10,
            },
        },
        "loggers": {
            "": {  # root logger
                "level": log_level,
                "handlers": ["console", "file", "error_file"],
            },
            "sqlalchemy.engine": {
                "level": logging.WARNING,
                "handlers": ["console"],
                "propagate": False,
            },
            "sqlalchemy.pool": {
                "level": logging.WARNING,
                "handlers": ["console"],
                "propagate": False,
            },
            "uvicorn": {
                "level": log_level,
                "handlers": ["console"],
                "propagate": False,
            },
            "uvicorn.access": {
                "level": log_level,
                "handlers": ["console"],
                "propagate": False,
            },
        },
    }
    
    logging.config.dictConfig(logging_config)
    return logging.getLogger(__name__)


def get_logger(name: str) -> logging.Logger:
    """
    Get logger instance.
    
    Args:
        name: Logger name (usually __name__)
        
    Returns:
        Logger instance
    """
    return logging.getLogger(name)
