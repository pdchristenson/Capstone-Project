# Local Back-end/API Environment (FastAPI)

## Requirements

### System
- Python 3.11 or greater
- Pip 24.0 or greater

### Environment Variables

The .env with the following variables ***must be placed at the same level*** as the cloned repository.
```
oc_key = <OpenCage API key>
cloud_project_id = <Google Cloud project ID>
mongo_uri = <MongoDB Atlas connection string>
database = <Database name>
collection = <Collection name>
mongo_key = <MongoDB API key>
gemini_key = <Google Gemini API key>
```

## Installation

To set up your local API environment, follow these steps:

1. Clone the repository locally:
   ```sh
   git clone <repository_url>
2. Navigate into the directory:
   ```sh
   cd <repository_name>
3. Install requirements using pip:
   ```sh
    pip install -r requirements.txt

## Usage

To start the local environment, run the following command:
  ```sh
  python -m uvicorn main:app --reload
  ```
***If your system uses 'python3' as the starting command, replace 'python'.***

This command will build the project and start a development server. You can then access your application at the specified localhost URL.

## License

This project is licensed under the MIT License.
