# Log Analyzer

## Overview

Log Analyzer is a web-based application that allows users to upload ZIP files containing logs, analyze them, and identify errors or warnings. It also provides the functionality to query the logs based on specific criteria using GPT-3.5 to suggest relevant log files for inspection. The application supports both overall log analysis and specific log file parsing based on GPT responses.

## Features

- **Upload and Extract Logs:** Upload ZIP files containing logs and extract them for analysis.
- **Analyze Logs:** Parse and display errors, warnings, and critical messages from log files in an organized table.
- **Query with GPT-3.5:** Input queries to get suggestions on which log files to check for specific issues.
- **Frequent Errors:** Display frequent errors found across all log files.
- **Filter and Search Logs:** Filter and search logs based on error type, message, and date.

## Technologies Used

- **Backend:** Python, Flask, OpenAI, Python-Evtx, dotenv
- **Frontend:** React, Material-UI, Axios
- **Other:** Node.js, NPM, Webpack

## Prerequisites

- Python 3.7+
- Node.js 14+
- NPM (Node Package Manager)

## Installation

### 1. Clone the Repository

git clone https://github.com/sufianqayyum131/log-analyzer.git
cd log-analyzer

### 2. Backend Setup

Create and activate a virtual environment:

python -m venv venv
source venv/bin/activate  # For Windows: venv\Scripts\activate
Install the backend dependencies:

pip install -r backend/requirements.txt
Configure environment variables:

### 3. Create a .env file in the backend directory with the following content:

OPENAI_API_KEY=your_openai_api_key_here

### 4. Run the Flask app:

cd backend
python app.py

### 5. Frontend Setup

Navigate to the frontend directory:

cd ../frontend
Install the frontend dependencies:

npm install
Start the React app:

npm start

### 6. Running the Application

Backend: Runs on http://localhost:5000
Frontend: Runs on http://localhost:3000
Ensure both the Flask server and React app are running simultaneously for full functionality.

### 7. Usage

Upload Logs
Navigate to http://localhost:3000.
Use the Upload Form to upload a ZIP file containing log files.
The application extracts the logs and displays errors in a table.
Query Logs
Use the Query Input to submit a query regarding log analysis.
The application utilizes GPT-3.5 to suggest relevant log files to check.
Only errors from the suggested log files are displayed in the table.
Frequent Errors
Frequent errors across all log files are displayed above the log table.

### 8. File Structure

log-analyzer/
│
├── backend/
│   ├── app.py
│   ├── log_parser.py
│   ├── log_directories.py
│   └── requirements.txt
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── LogTable.js
│   │   │   ├── UploadForm.js
│   │   │   ├── QueryForm.js
│   │   ├── App.js
│   │   ├── index.css
│   │   ├── index.js
│   └── package.json
│
├── .gitignore
└── README.md

### 9. Development Notes

Log Parsing: The log_parser.py handles the extraction and parsing of log files.
GPT Integration: The app.py sends user queries to OpenAI's GPT-3.5 for suggestions on relevant log files.
React Components: The frontend uses React components to handle file uploads, display logs, and query logs.


Feel free to fork this repository and submit pull requests to contribute to the project. For major changes, please open an issue first to discuss what you would like to change.

### License
This project is licensed under the MIT License - see the LICENSE file for details.

Acknowledgements
OpenAI
Flask
React
Material-UI
Python-Evtx