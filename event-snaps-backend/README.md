# EventSnaps Backend

This repository contains the backend code for the EventSnaps application, which is built using Node.js, Express, Google Drive API, and AWS Rekognition for managing and organizing event photos.

## Prerequisites

Before you can run the EventSnaps backend, you'll need the following:

- Node.js installed on your local machine
- A Google Cloud Platform project with the Google Drive API enabled and a service account created
- AWS Rekognition access with AWS Access Key ID and Secret Access Key

## Getting Started

To get started with the EventSnaps backend, follow these steps:

1. Clone the repository:
```
git clone https://github.com/yourusername/eventsnaps-backend.git
cd eventsnaps-backend
```  
2. Install the required dependencies:
```
npm install
```
3. Create a `.env` file in the root folder of the project, and fill in the necessary environment variables:


4. Place the `credentials.json` file containing your Google Cloud Platform service account key in the root folder of the project.

5. Start the backend server:

```
npm start
```

The EventSnaps backend server will start running on `http://localhost:3001/`.

## API Endpoints

The EventSnaps backend provides the following API endpoints:

- `POST /api/compare`: Compares an uploaded image with images stored in a Google Drive folder and returns matching images using AWS Rekognition
- `POST /api/upload`: Uploads multiple images to the Google Drive folder
- `GET /api/download/:fileId`: Downloads an image with a specified fileId from the Google Drive folder



Happy coding!


