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
const pageTitle = "HalifaxFoodie - Restaurant Dashboard";
const pageDescription = "Welcome to Halifax Foodie";

function RestaurantDashboard() {
  const history = useHistory();

  const [data, setData] = useState({});

  useEffect(() => {
    const userObj = JSON.parse(localStorage.getItem("user"));
    const tokenObj = { token: userObj["stsTokenManager"]["accessToken"] };
    axios.post("/api/verifyToken", tokenObj).then((resp) => {
      console.log("valid token");
      if (resp.data.message !== "valid token") {
        Swal.fire({
          icon: "warning",
          title: "Token Expired. Login Again!!",
          showConfirmButton: false,
          timer: 1500,
        });
        history.push("/logout");
      }
    });
  }, []);

  useEffect(() => {
    const getData = async () => {
      let user = JSON.parse(localStorage.getItem("user"));
      const result = await axios.get(
        "https://us-central1-csci5410-316320.cloudfunctions.net/hfx-foodie-sapp2-get?restaurant_id=" +
          user.uid
      );
      return result.data;
    };

    setData(getData().then((res) => setData(res.data[0])));
  }, []);

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
  const handleSubmit = (e) => {
    e.preventDefault();
    let user = JSON.parse(localStorage.getItem("user"));
    let formData = new FormData(e.target);
    formData.append("restaurant_id", user.uid);
    const conf = {
      headers: {
        "content-type": "multipart/form-data",
      },
    };

    const submitForm = async () => {
      return await axios.post(
        "https://us-central1-csci5410-316320.cloudfunctions.net/hfx-foodie-sapp2-add",
        formData,
        conf
      );
    };
    submitForm()
      .then((res) =>
        Swal.fire({
          icon: "success",
          title: res.message,
          showConfirmButton: false,
          timer: 1500,
        })
      )
      .then(() => {
        window.location.reload();
      });
  };

  return (
    <div>
      <Meta title={pageTitle} />
      <Header
        head="Dashboard"
        // description="Food Menu"
        style={{ align: "left" }}
      />

      <Menu />
      <Container>
        <Row>
          <Col>
            <Card className="mb-3">
              <Card.Header>Add New Item</Card.Header>
              <Card.Body>
                <Form onSubmit={handleSubmit}>
                  <Form.Group controlId="NewThumbnail">
                    <Form.Label>Thumbnail</Form.Label>
                    <Form.Control
                      type="file"
                      name="thumbnail"
                      placeholder="Upload thumbnail image..."
                      required
                    />
                  </Form.Group>
                  <Form.Group controlId="NewTitle">
                    <Form.Label>Title</Form.Label>
                    <Form.Control
                      type="input"
                      name="title"
                      placeholder="Enter title..."
                      required
                    />
                  </Form.Group>
                  <Form.Group controlId="NewPostTextArea">
                    <Form.Label>Description</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      minLength="15"
                      name="description"
                      placeholder="Enter description..."
                      required
                    />
                  </Form.Group>
                  <Button
                    type="submit"
                    style={{ float: "right" }}
                    variant="primary"
                  >
                    Add
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col>
            <h3>Food Items</h3>
          </Col>
        </Row>
        <Row className="justify-content-md-center">
          <Col>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Thumbnail</th>
                  <th>Title</th>
                  <th>Description</th>
                  <th>Label</th>
                  <th>Similarity</th>
                </tr>
              </thead>
              <tbody>
                {data.length &&
                  data.map(function (row, index) {
                    return (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>
                          <img src={row.thumbnail} height="100px" alt="" />
                        </td>
                        <td>{row.title}</td>
                        <td>{row.description}</td>
                        <td>{row.prediction.label}</td>
                        <td>{row.prediction.confidence}</td>
                      </tr>
                    );
                  })}
              </tbody>
            </Table>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default RestaurantDashboard;
