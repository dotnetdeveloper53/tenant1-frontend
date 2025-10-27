# CRM Frontend

React application with Material-UI for contact management.

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm start
```

Application available at: `http://localhost:3000`

## Features

- **Contact Grid**: Sortable data table with edit/delete actions
- **Contact Form**: Modal form for creating and editing contacts
- **Health Check**: Real-time API connection status
- **Responsive Design**: Works on desktop and mobile devices
- **Error Handling**: User-friendly error messages and notifications

## Components

### App.js
Main application component managing state and API interactions.

### ContactsGrid.js
Data grid component using Material-UI DataGrid with pagination and sorting.

### ContactForm.js
Modal form component for contact creation and editing with validation.

### HealthCheck.js
Component that monitors backend API connectivity.

## API Integration

The frontend communicates with the PHP backend API at `http://localhost:9001/api`.

All API calls include proper error handling and user feedback through snackbar notifications.

## Available Scripts

- `npm start` - Start development server
- `npm build` - Build for production
- `npm test` - Run tests

## Dependencies

- React 18
- Material-UI 5
- Axios for API calls
- Material-UI Data Grid for table functionality