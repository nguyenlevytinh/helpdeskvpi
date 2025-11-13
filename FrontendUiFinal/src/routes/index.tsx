import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import AppLayout from "../components/layout/AppLayout";
import DashboardPage from "../pages/Dashboard";
import TicketsPage from "../pages/Tickets";
import TicketDetailPage from "../pages/TicketDetail";
import LoginPage from "../pages/Login";
import CreateTicketPage from "../pages/Tickets/CreateTicket";
import { ProtectedRoute } from "../components/ProtectedRoute";

const AppRoutes: React.FC = () => {
  return (

      <Routes>
        {/* login nằm ngoài frame */}
        <Route path="/login" element={<LoginPage />} />

        {/* layout chính */}
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<ProtectedRoute page="dashboard"><DashboardPage /></ProtectedRoute>} />
          <Route path="/tickets" element={<ProtectedRoute page="tickets"><TicketsPage /></ProtectedRoute>} />
          <Route path="/tickets/create" element={<CreateTicketPage />} />
          <Route path="/tickets/:id" element={<TicketDetailPage />} />
          <Route path="*" element={<Navigate to="/tickets" />} />
        </Route>
      </Routes>
  );
};

export default AppRoutes;
