import { Navbar, Nav, Container, Button } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import React, { Component } from "react";

import logo from "../images/logo.svg";

const MenuBlank = () => {
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
          <Nav className="ml-auto"></Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default MenuBlank;
