#app.py
import os
from flask import Flask, request, jsonify
from googleapiclient.discovery import build
import gspread
from google.oauth2.service_account import Credentials
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes by default

# Load the credentials from the downloaded JSON key file
scopes = ['https://www.googleapis.com/auth/spreadsheets']

# Get the directory path of the current script
current_dir = os.path.dirname(os.path.abspath(__file__))

# Construct the full path to the credentials file
credentials_path = os.path.join(current_dir, 'config', 'google-sheets-credentials.json')

# Initialize credentials
creds = Credentials.from_service_account_file(credentials_path, scopes=scopes)

# Authorize Google Sheets API
client = gspread.authorize(creds)

# Connect to the Google Sheets API
service = build('sheets', 'v4', credentials=creds)
spreadsheet_id = '1A9wibWu0HjDcUWBpV8YDpQYbwYPnenMFgJSwXIF6kg8'  # Replace with your actual spreadsheet ID

# Endpoint to fetch data from Google Sheets
@app.route('/api/data/get', methods=['GET'])
def get_data():
    try:
        sheet = service.spreadsheets()
        result = sheet.values().get(spreadsheetId=spreadsheet_id, range='Thresholds!A1:K100').execute()
        values = result.get('values', [])

        # Check if values exist
        if not values:
            return jsonify({'error': 'No data found'}), 404

        # Assuming the first row contains headers
        headers = values[0]
        data = []

        # Iterate over rows starting from the second row (values[1:])
        for row in values[1:]:
            entry = {}
            for idx, header in enumerate(headers):
                if idx < len(row):
                    entry[header] = row[idx]
            data.append(entry)

        return jsonify(data)
    except Exception as e:
        return jsonify({'error': str(e)}), 500


# Endpoint to add data to Google Sheets
# Ensure 'Key' and 'Trading_Symbol' are not submitted by the frontend
@app.route('/api/data/post', methods=['POST'])
def add_data():
    try:
        data = request.get_json()
        # Ensure required fields are present
        required_fields = ['Key','Trading_Symbol','Stock_Name', 'Expiry_Year', 'Expiry_Month', 'Strike_Price', 'Options', 'Target', 'Stop_Loss', 'Status']
        if not all(field in data for field in required_fields):
            return jsonify({'error': 'Missing required fields.'}), 400
        sheet = service.spreadsheets()
        value_range_body = {'values': [list(data.values())]}
        result = sheet.values().append(spreadsheetId=spreadsheet_id, range='Thresholds!A:J', valueInputOption='USER_ENTERED', body=value_range_body).execute()
        return jsonify(result)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

    
# Endpoint to fetch stock names from Google Sheets
@app.route('/api/stock-names', methods=['GET'])
def get_stock_names():
    try:
        # Access the Stock Details sheet
        sheet = client.open_by_key(spreadsheet_id).worksheet('Stock Details')
        # Get all values from column A starting from row 2 (excluding the header)
        stock_names = sheet.col_values(1)[1:]
        return jsonify(stock_names)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Endpoint to fetch months from Google Sheets
@app.route('/api/months', methods=['GET'])
def get_months():
    try:
        # Access the Stock Details sheet
        sheet = client.open_by_key(spreadsheet_id).worksheet('Stock Details')
        # Get all values from column A starting from row 2 (excluding the header)
        stock_names = sheet.col_values(3)[1:]
        return jsonify(stock_names)
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    

if __name__ == '__main__':
    app.run(port=5000, debug=True)
