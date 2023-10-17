import React, { useContext } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import { authRoutes, publicRoutes } from "../routes";
import { Context } from "..";

function AppRouter({ profileSelected, setProfileSelected }) {
  const { user } = useContext(Context);

  return (
    <Routes>
      {user.isAuth &&
        authRoutes.map(({ path, Component }) => (
          <Route key={path} path={path} element={Component} />
        ))}
      {publicRoutes.map(({ path, Component }) => (
        <Route key={path} path={path} element={Component} />
      ))}
      <Route path="*" element={<Navigate to="/news" replace />} />
    </Routes>
  );
}

export default AppRouter;
