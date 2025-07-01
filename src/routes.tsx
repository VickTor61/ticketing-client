import React from "react";
import { Routes as RouterRoutes, Route } from "react-router-dom";

import { Register } from "./components/register";
import { Login } from "./components/login";
import Dashboard from "./components/Dashboard";

const Routes: React.FC = () => (
  <RouterRoutes>
    <Route path="/" element={<Dashboard />} />
    <Route path="/register" element={<Register />} />
    <Route path="/login" element={<Login />} />
  </RouterRoutes>
);

export default Routes;
