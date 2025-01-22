# Currency Converter API Integration

This is a simple Node.js application that integrates with a third-party currency conversion API to perform currency conversions and fetch exchange rates.

## Features

- **Currency Conversion**: Convert one currency to another using real-time exchange rates.
- **Exchange Rates**: Fetch the latest exchange rates for a specified base currency.
- **Error Handling**: Includes robust validation and error messages for invalid inputs and failed API requests.

## Tech Stack

- **Backend**: Node.js
- **Framework**: Express
- **API**: Fetch real-time exchange rates from a third-party currency conversion API.
- **Testing**: Jest for unit tests.

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/jagathvm/Currency-Converter-API-Integration.git
   cd Currency-Converter-API-Integration
   ```

2. Install the dependencies:

   ```bash
   npm install
   ```

3. Set up environment variables in a `.env` file:

   ```
   API_URI=<your-api-uri>
   ```

   Replace `<your-api-uri>` with the base URL for the currency conversion API you're using.

## Usage

To start the server, run:

```bash
npm start
```

The server will start listening on port `8000` by default. You can change the port by modifying the `PORT` variable in the `.env` file or by passing the `PORT` environment variable.

### API Endpoints

#### `POST /convert`

Converts an amount from one currency to another.

- **Request body**:

  ```json
  {
    "from": "USD",
    "to": "EUR",
    "amount": 100
  }
  ```

- **Response**:
  ```json
  {
    "from": "USD",
    "to": "EUR",
    "amount": 100,
    "convertedAmount": 85.62
  }
  ```

#### `GET /rates`

Fetches the exchange rates for a base currency.

- **Query Parameters**:
  `base` (optional, default: `USD`) - The base currency.

- **Response**:
  ```json
  {
    "result": "success",
    "base": "USD",
    "rates": {
      "EUR": 0.8562,
      "GBP": 0.7654
    }
  }
  ```

## Testing

To run the tests, use the following command:

```bash
npm test
```

This will run the unit tests using Jest.

## Project Structure

```
/Currency-Converter-API-Integration
│
├── /src
│   ├── /controllers         # Controller logic for handling requests
│   ├── /routes              # API routes
│   ├── /services            # Services for interacting with the currency API
│   ├── /helpers             # Helper functions for validation and API calls
│   ├── /config              # Configuration files (e.g., API URIs)
│   ├── app.js               # Express app setup
│   └── server.js            # Server entry point
│
├── /tests                   # Unit tests
├── .babelrc                 # Babel configuration
├── jest.config.js           # Jest configuration
├── package.json             # Project dependencies and scripts
├── .env                     # Environment variables
└── README.md                # Project documentation
```

## License

This project is licensed under the MIT License.
