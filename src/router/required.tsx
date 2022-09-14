import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useToken } from "../hooks/token";
import { Outlet } from "react-router-dom";
import Topbar from "../components/Narbar";
import SideBar from "../components/Sidebar";
import { restore } from "../service/store/auth.reducer";
import { useAppDispatch } from "../service/store/store";
export const RequiredRouter = () => {
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(restore());
  }, []);
  const isAuth = useToken();
  return isAuth ? (
    <>
      <div className="Navbar">
        <Topbar />
      </div>
      <div className="Content">
        <div className="Sidebar">
          <SideBar />
        </div>
        <div className="Route">
          <Outlet />
        </div>
      </div>
    </>
  ) : (
    <Navigate
      to="login"
      replace={true}
    />
  );
};
