import requests, gzip, shutil
from lxml import etree
from datetime import datetime
from app import app, db
from models import CPE

#  Download the XML file, If you want to download the file manually, uncomment the lines below
#url = "https://nvd.nist.gov/feeds/xml/cpe/dictionary/official-cpe-dictionary_v2.3.xml.gz"
#response = requests.get(url)
#with open('cpe_dict.xml.gz', 'wb') as f:
#    f.write(response.content)

# 🗜️ Unzip the file
with gzip.open('official-cpe-dictionary_v2.3.xml.gz', 'rb') as f_in:
    with open('official-cpe-dictionary_v2.3.xml', 'wb') as f_out:
        shutil.copyfileobj(f_in, f_out)

# 🛠️ Parse the XML
tree = etree.parse('official-cpe-dictionary_v2.3.xml')
root = tree.getroot()
namespace = {'cpe': 'http://cpe.mitre.org/dictionary/2.0'}

def extract_and_load():
    with app.app_context():
        for item in root.findall('.//cpe:cpe-item', namespace):
            title_el = item.find('.//cpe:title', namespace)
            cpe_22_uri = item.get('name')
            refs = item.findall('.//cpe:reference', namespace)
            ref_links = [ref.get('href') for ref in refs]

            dep_date_el = item.find('.//cpe:deprecation', namespace)
            dep_date_22 = dep_date_el.get('date') if dep_date_el is not None else None

            # 🔥 Add each CPE entry into the DB
            cpe = CPE(
                cpe_title=title_el.text if title_el is not None else None,
                cpe_22_uri=cpe_22_uri,
                cpe_23_uri=None,  # Can add logic later for 2.3
                reference_links=ref_links,
                cpe_22_deprecation_date=datetime.strptime(dep_date_22, '%Y-%m-%d') if dep_date_22 else None,
                cpe_23_deprecation_date=None  # Can add logic later
            )
            db.session.add(cpe)
        db.session.commit()

# ✅ Run the loader
extract_and_load()
