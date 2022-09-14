import { useMemo } from "react";
import { Route, Routes, unstable_HistoryRouter as Router } from "react-router-dom";
import history from "../utils/history";
import routers, { RouteValue } from "./constants";
import "./index.scss";

const renderChildrenRoute = (routers: RouteValue[]) => {
  return routers.map((value, index) => {
    return (
      <Route
        key={index}
        path={value.path}
        element={<value.component />}
      >
        {value.children ? renderChildrenRoute(value.children) : <></>}
      </Route>
    );
  }, []);
};
const AppRouter = () => {
  const route = useMemo(() => {
    return renderChildrenRoute(routers);
  }, []);
  return (
    <div className="App">
      <Router history={history}>
        <Routes>{route}</Routes>
      </Router>
    </div>
  );
};
export default AppRouter;
