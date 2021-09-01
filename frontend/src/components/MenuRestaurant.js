import { Navbar, Nav, Container, Button, NavDropdown } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import React from "react";

import logo from "../images/logo.svg";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";

const Menu = () => {
  const dynamoDbObj = JSON.parse(localStorage.getItem("dynamoDbObj"));
  const username = "Welcome ".concat(dynamoDbObj && dynamoDbObj.name);
  return (
    <Navbar bg="dark" variant="dark" expand="lg" fixed="top" collapseOnSelect>
      <Container>
        <LinkContainer to="/">
          <Navbar.Brand>
            <img src={logo} alt="HalifaxFoodie" style={{ width: "2.5rem" }} />
            <span> HalifaxFoodie</span>
          </Navbar.Brand>
        </LinkContainer>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ml-auto">
            <LinkContainer to="/restaurant/dashboard">
              <Nav.Link>Dashboard</Nav.Link>
            </LinkContainer>
            <LinkContainer to="/restaurant/analytics">
              <Nav.Link>Analytics</Nav.Link>
            </LinkContainer>
            <LinkContainer to="/restaurant/wordcloud">
              <Nav.Link>Word Cloud</Nav.Link>
            </LinkContainer>

            <div style={{ display: "flex", color: "white" }}>
              <NavDropdown
                id="nav-dropdown-dark-example"
                title={username}
                variant="dark"
              >
                <NavDropdown.Item href="/changepassword">
                  Change password
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item href="/logout">
                  Log out &nbsp;
                  <ExitToAppIcon></ExitToAppIcon>
                </NavDropdown.Item>
              </NavDropdown>
            </div>
            <LinkContainer to="/login">
              <div>
                <Button variant="dark"></Button>
              </div>
            </LinkContainer>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Menu;
