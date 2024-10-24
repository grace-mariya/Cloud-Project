from flask import Blueprint

views = Blueprint('view', __name__)

@views.route('/')

def Library():
    return "<h1>Test</h1>"
