// Imports
import app from "./app.js";

// Constants
const PORT = process.env.PORT || 8000;

// Server
app.listen(PORT, () => {
  console.log(`server listening requests on http://localhost:${PORT}`);
});
