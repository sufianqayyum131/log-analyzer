from flask import Flask, request, jsonify
from flask_cors import CORS
from werkzeug.utils import secure_filename
import os
from log_parser import parse_log_files_in_folder, extract_zip, parse_specific_logs
from log_directories import log_directories
from openai import OpenAI
from dotenv import load_dotenv
import re

load_dotenv()

UPLOAD_FOLDER = 'extracted_logs'
ALLOWED_EXTENSIONS = {'zip'}

app = Flask(__name__)
CORS(app)

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Initialize the OpenAI client
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

if not client.api_key:
    raise ValueError("OPENAI_API_KEY is not set in the environment variables")

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({'status': 'error', 'message': 'No file part'}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({'status': 'error', 'message': 'No selected file'}), 400
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        zip_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(zip_path)
        
        # Extract zip file
        extract_to = os.path.join(app.config['UPLOAD_FOLDER'], filename.rsplit('.', 1)[0])
        extract_zip(zip_path, extract_to)
        
        # Parse logs
        log_data, error_counts = parse_log_files_in_folder(extract_to)
        
        # Generate a report of frequent errors
        frequent_errors = {k: v for k, v in error_counts.items() if v > 3}  # Adjust threshold as needed
        
        return jsonify({'status': 'success', 'message': 'File uploaded, extracted, and analyzed', 'data': log_data, 'frequent_errors': frequent_errors})
    return jsonify({'status': 'error', 'message': 'File type not allowed'}), 400

@app.route('/query', methods=['POST'])
def query():
    try:
        data = request.get_json()
        user_query = data.get('query', '')

        if not user_query:
            return jsonify({'status': 'error', 'message': 'No query provided'}), 400

        gpt_response = generate_gpt_response(user_query)
        specific_logs = extract_log_file_names(gpt_response)

        # Print GPT response and extracted log file names
        print(f"GPT Response: {gpt_response}")
        print(f"Extracted log file names: {specific_logs}")

        return jsonify({'status': 'success', 'response': gpt_response, 'specific_logs': specific_logs})

    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500

def generate_gpt_response(customer_query):
    # Build detailed log file information for the prompt
    log_details = []
    for directory, info in log_directories.items():
        files_info = "\n".join([f"{file_name}: {desc}" for file_name, desc in info['files'].items()])
        log_details.append(f"Directory: {directory}\nDescription: {info['description']}\nFiles:\n{files_info}\n")

    detailed_log_info = "\n".join(log_details)
    
    prompt = (
        f"Based on the query: '{customer_query}', suggest which logs to check in the GFI Archiver system. "
        f"The logs are documented in the following directories with their respective files and descriptions:\n{detailed_log_info}"
        f"Provide a customer-friendly response focusing on specific log files and directories that might be relevant."
    )

    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "system", "content": "You are a helpful assistant."},
            {"role": "user", "content": prompt}
        ],
        max_tokens=1000
    )

    gpt_response = response.choices[0].message.content
    return gpt_response

def extract_log_file_names(gpt_response):
    # Extract .log file names from GPT response
    log_files = re.findall(r'\*\*(.*?)\.log\*\*', gpt_response)
    return [file.strip() for file in log_files]

@app.route('/analyze_specific', methods=['POST'])
def analyze_specific():
    data = request.get_json()
    specific_logs = data.get('specific_logs', [])
    extracted_logs_path = os.path.join(app.config['UPLOAD_FOLDER'])

    log_data = parse_specific_logs(extracted_logs_path, specific_logs)

    return jsonify({'status': 'success', 'data': log_data})

if __name__ == '__main__':
    os.makedirs(UPLOAD_FOLDER, exist_ok=True)
    app.run(debug=True)
