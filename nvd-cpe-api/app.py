from flask import Flask, request
from models import db, CPE
from collections import OrderedDict
from flask_cors import CORS
import json

app = Flask(__name__)
CORS(app)
# 📢 Set your database connection string here
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:chiragbsoni@localhost:5432/cpe_db'

db.init_app(app)

# ✅ API Endpoint: Get all CPEs (paginated)
@app.route('/api/cpes')
def get_cpes():
    page = request.args.get('page', 1, type=int)
    limit = request.args.get('limit', 10, type=int)
    pagination = CPE.query.paginate(page=page, per_page=limit, error_out=False)
    items = []
    for cpe in pagination.items:
        items.append(OrderedDict({
            'id': cpe.id,
            'cpe_title': cpe.cpe_title,
            'cpe_22_uri': cpe.cpe_22_uri,
            'cpe_23_uri': cpe.cpe_23_uri,
            'reference_links': cpe.reference_links,
            'cpe_22_deprecation_date': cpe.cpe_22_deprecation_date.isoformat() if cpe.cpe_22_deprecation_date else None,
            'cpe_23_deprecation_date': cpe.cpe_23_deprecation_date.isoformat() if cpe.cpe_23_deprecation_date else None
        }))
    return app.response_class(
        response=json.dumps({
        'page': page,
        'limit': limit,
        'total': pagination.total,
        'data': items
    }, indent=4),
        mimetype='application/json'
    )

# ✅ API Endpoint: Search CPEs
@app.route('/api/cpes/search')
def search_cpes():
    query = CPE.query
    title = request.args.get('cpe_title')
    uri_22 = request.args.get('cpe_22_uri')
    uri_23 = request.args.get('cpe_23_uri')
    dep_date = request.args.get('deprecation_date')

    if title:
        query = query.filter(CPE.cpe_title.ilike(f'%{title}%'))
    if uri_22:
        query = query.filter(CPE.cpe_22_uri.ilike(f'%{uri_22}%'))
    if uri_23:
        query = query.filter(CPE.cpe_23_uri.ilike(f'%{uri_23}%'))
    if dep_date:
        query = query.filter(
            (CPE.cpe_22_deprecation_date <= dep_date) |
            (CPE.cpe_23_deprecation_date <= dep_date)
        )

    results = query.all()
    items = []
    for cpe in results:
        items.append(OrderedDict({
            'id': cpe.id,
            'cpe_title': cpe.cpe_title,
            'cpe_22_uri': cpe.cpe_22_uri,
            'cpe_23_uri': cpe.cpe_23_uri,
            'reference_links': cpe.reference_links,
            'cpe_22_deprecation_date': cpe.cpe_22_deprecation_date.isoformat() if cpe.cpe_22_deprecation_date else None,
            'cpe_23_deprecation_date': cpe.cpe_23_deprecation_date.isoformat() if cpe.cpe_23_deprecation_date else None
        }))
    #return jsonify({'data': items})
    return app.response_class(
        response=json.dumps({
        'data': items
    }, indent=4),
        mimetype='application/json'
    )
if __name__ == '__main__':
    app.run(debug=True)


#from app import app, db

#with app.app_context():
#    db.create_all()