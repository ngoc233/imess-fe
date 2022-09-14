import React, { useState } from "react";
import { Collapse, Dropdown, DropdownItem, DropdownMenu, DropdownToggle, Nav, Navbar, NavItem } from "reactstrap";
import "./navbar.scss";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../../service/store/store";
import { routerPaths } from "../../utils/constanst";

const Topbar: React.FC<any> = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [openNavbar, setOpenNavbar] = useState(false);
  const user: any = useAppSelector((st) => st.auth.user);

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    navigate(routerPaths.login);
  };

  const handleCloseNavbar = () => {
    setOpenNavbar(!openNavbar);
  };

  return (
    <Navbar
      color="light"
      light
      className="navbar shadow-sm p-3 mb-5 bg-white rounded flex justify-content-between"
      expand="md"
    >
      <div>
        <span
          onClick={() => {}}
          className="fw-bold fs-6"
        >
          Imess
        </span>
      </div>
      <div>
        <Collapse
          isOpen={true}
          navbar
        >
          <Nav
            className="ml-auto"
            navbar
          >
            <NavItem>
              <Dropdown
                isOpen={isOpen}
                toggle={() => setIsOpen(!isOpen)}
                className="dropdown-navbar"
              >
                <img
                  src="/assets/images/profile.png"
                  alt="Profile"
                />
                <DropdownToggle
                  className="d-xs-none"
                  caret
                >
                  {user?.email || "Administrator"}
                </DropdownToggle>
                <DropdownMenu>
                  <DropdownItem>Edit Profile</DropdownItem>
                  <DropdownItem onClick={handleLogout}>Logout</DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </NavItem>
          </Nav>
        </Collapse>
      </div>
    </Navbar>
  );
};

export default Topbar;
