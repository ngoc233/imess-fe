import { faBriefcase, faHome } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classNames from "classnames";
import { FC } from "react";
import { Link } from "react-router-dom";
import { Nav, NavItem, NavLink } from "reactstrap";
import SubMenu from "./subMenu";
import "./sidebar.scss";
import { routerPaths } from "../../utils/constanst";

const SideBar: FC<any> = ({ isOpen, toggle }) => (
  <div className={classNames("sidebar", { "is-open": isOpen })}>
    <div className="side-menu">
      <Nav
        vertical
        className="list-unstyled pb-3"
      >
        <NavItem>
          <NavLink
            tag={Link}
            to={routerPaths.home}
          >
            <FontAwesomeIcon
              icon={faBriefcase}
              className="mr-2"
            />
            Home
          </NavLink>
        </NavItem>
        <SubMenu
          title="Máy chủ Imess"
          icon={faHome}
          items={submenus[0]}
        />
      </Nav>
    </div>
  </div>
);

const submenus = [
  [
    {
      title: "Imess",
      target: routerPaths.imess,
    },
    {
      title: "device",
      target: routerPaths.device,
    },
  ],
];

export default SideBar;
