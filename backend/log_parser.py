import os
import re
from collections import defaultdict

def parse_log_file(file_path):
    error_counts = defaultdict(int)
    errors = []

    with open(file_path, 'r', encoding='utf-8', errors='ignore') as file:
        for line_number, line in enumerate(file, start=1):
            match = re.match(
                r'(\d{4}-\d{2}-\d{2}),(\d{2}:\d{2}:\d{2}),\d+,\d+,"#\d+","#\d+","(error|warning|critical)\s*","([^"]+)","(.*)"',
                line,
                re.IGNORECASE
            )
            if match:
                timestamp = f"{match.group(1)} {match.group(2)}"
                error_type = match.group(3).strip()
                file_name = match.group(4)
                message = match.group(5).strip()
                
                error_key = f"{error_type}::{message}"  # Use error type and message to uniquely identify errors
                error_counts[error_key] += 1
                
                errors.append({
                    'line_number': line_number,
                    'timestamp': timestamp,
                    'error_type': error_type,
                    'file': file_name,
                    'message': message,
                    'path': file_path
                })
    return errors, error_counts

def parse_log_files_in_folder(folder_path):
    all_errors = []
    aggregated_error_counts = defaultdict(int)

    for root, _, files in os.walk(folder_path):
        for file in files:
            if file.endswith('.log') or re.match(r'log.*', file):
                file_path = os.path.join(root, file)
                errors, error_counts = parse_log_file(file_path)
                all_errors.extend(errors)
                
                for error_key, count in error_counts.items():
                    aggregated_error_counts[error_key] += count

    return all_errors, aggregated_error_counts

def parse_specific_logs(folder_path, specific_logs):
    all_errors = []
    for root, _, files in os.walk(folder_path):
        for file in files:
            if file in specific_logs:
                file_path = os.path.join(root, file)
                errors, _ = parse_log_file(file_path)
                all_errors.extend(errors)
    return all_errors

def extract_zip(zip_path, extract_to):
    import zipfile
    with zipfile.ZipFile(zip_path, 'r') as zip_ref:
        zip_ref.extractall(extract_to)
