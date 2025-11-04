import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import React from "react";
import router from "./routes/router";

import "./index.css";
 

createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <RouterProvider router={router} />
    </React.StrictMode>
);
