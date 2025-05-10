from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class CPE(db.Model):
    __tablename__ = 'cpe'
    id = db.Column(db.Integer, primary_key=True)
    cpe_title = db.Column(db.String)
    cpe_22_uri = db.Column(db.Text)
    cpe_23_uri = db.Column(db.Text)
    reference_links = db.Column(db.JSON)  # Stores array of URLs as JSON
    cpe_22_deprecation_date = db.Column(db.Date)
    cpe_23_deprecation_date = db.Column(db.Date)
