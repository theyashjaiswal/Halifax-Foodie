import React, { useEffect, useState } from "react";
import Header from "../../components/Header";
import Meta from "../../components/Meta";
import Menu from "../../components/MenuRestaurant";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import axios from "axios";
import Cookies from "js-cookie";
import Card from "react-bootstrap/Card";
import Swal from "sweetalert2";

import { useHistory } from "react-router-dom";
import { Table } from "react-bootstrap";

const FormData = require("form-data");
const fs = require("fs");

// page content
const pageTitle = "HalifaxFoodie - Restaurant Analytics";
const pageDescription = "Welcome to Halifax Foodie";

function RestaurantAnalytics() {
  const history = useHistory();

  if (
    JSON.parse(localStorage.getItem("dynamoDbObj")).usertype !== "restaurant"
  ) {
    Swal.fire({
      icon: "error",
      title: "Insufficient Access!!!",
      showConfirmButton: false,
      timer: 1500,
    });
    history.push("/");
  }
  if (!localStorage.getItem("authStatus")) {
    Swal.fire({
      icon: "error",
      title: "NOT LOGGED IN",
      showConfirmButton: false,
      timer: 1500,
    });
    history.push("/");
  }
  return (
    <div>
      <Meta title={pageTitle} />
      <Header
        head="Analytics"
        description="Powered by DataStudio"
        style={{ align: "left" }}
      />

      <Menu />
      <Container>
        <Row className="justify-content-md-center">
          <Col>
            <div className="embed-responsive embed-responsive-4by3">
              <iframe
                className="embed-responsive-item"
                src="https://datastudio.google.com/embed/reporting/6d27ca4a-2716-4b60-a9ec-16cf809ab0fa/page/qfWWC"
                allowFullScreen
              ></iframe>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default RestaurantAnalytics;
