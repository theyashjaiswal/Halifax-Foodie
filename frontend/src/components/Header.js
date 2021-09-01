import { Container } from "react-bootstrap";
import React, { Component } from "react";

const Header = ({ head, description }) => {
  return (
    <Container>
      <div className="starter-template text-center my-5">
        <h1>{head}</h1>
        <p className="lead text-capitalize">{description}</p>
      </div>
    </Container>
  );
};

export default Header;
