# EventSnaps Frontend

This repository contains the frontend code for the EventSnaps application, which utilizes React, Vite, Tailwind and TypeScript to build a user-friendly interface for managing and organizing event photos.


## Getting Started

Follow these instructions to set up the frontend on your local machine.

1. **Clone the repository**

   Clone the EventSnaps frontend repository using the following command:
```
git clone https://github.com/yourusername/eventsnaps-frontend.git
```


Replace `yourusername` with the appropriate username or organization.

2. **Install dependencies**

Navigate to the project directory and install the required dependencies:

```
cd eventsnaps-frontend
npm install
```

3. **Configure API URL**

Update the `apiUrl` variable in `App.tsx` to point to the backend API. This should be the URL where the event-snaps-backend server is running. For example:

```javascript
const apiUrl = "http://localhost:3001/api";
```
4. **Start the development server**

```
npm start
```

## Contributing

Contributions to the EventSnaps frontend are always welcome. If you encounter any issues or have suggestions for improvements, please feel free to open an issue or submit a pull request.

Happy coding!
