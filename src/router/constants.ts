import Login from "../apps/login";
import { RequiredRouter } from "./required";
import { FC } from "react";
import Home from "../apps/home";
import Imess from "../apps/imess";
import Device from "../apps/device";
import { routerPaths } from "../utils/constanst";
import CreateDevicePage from "../apps/createDevice";

export interface RouteValue {
  path: string;
  component: FC;
  children?: RouteValue[];
}

const routers: RouteValue[] = [
  {
    path: "/",
    component: RequiredRouter,
    children: [
      { path: routerPaths.home, component: Home },
      { path: routerPaths.imess, component: Imess },
      { path: routerPaths.device, component: Device },
      { path: routerPaths.creatDevice, component: CreateDevicePage },
    ],
  },
  {
    path: routerPaths.login,
    component: Login,
  },
];
export default routers;
