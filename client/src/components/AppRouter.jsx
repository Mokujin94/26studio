import React, { useContext } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import { adminRoutes, authRoutes, publicRoutes } from "../routes";
import { Context } from "..";
import { observer } from "mobx-react-lite";

const AppRouter = observer(() => {
  const { user } = useContext(Context);
  console.log(user)
  return (
    <Routes>
      {user.user.roleId > 1 && 
        adminRoutes.map(({ path, Component }) => (
          <Route key={path} path={path} element={Component} />
        ))
      }
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
});

export default AppRouter;
