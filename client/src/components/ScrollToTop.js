import { useContext, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Context } from "..";

export default function ScrollToTop() {
  const { pathname } = useLocation();
  const { user } = useContext(Context);
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
    user.setPath(pathname);
  }, [pathname]);
  return null;
}
