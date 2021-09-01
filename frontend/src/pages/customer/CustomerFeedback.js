import React, { useState, useEffect } from "react";
import Header from "../../components/Header";
import Meta from "../../components/Meta";
import Menu from "../../components/Menu";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import axios from "axios";
import Cookies from "js-cookie";
import Card from "react-bootstrap/Card";
import { Interactions } from "aws-amplify";
import Swal from "sweetalert2";
import { useHistory } from "react-router-dom";
import MenuCustomer from "../../components/MenuCustomer";

const pageTitle = "Feedback";

function CustomerFeedback() {
  const history = useHistory();
  if (JSON.parse(localStorage.getItem("dynamoDbObj")).usertype !== "customer") {
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

  const submitReview = (e) => {
    e.preventDefault();
    console.log("Dish form " + e.target.postDish.value);
    console.log("Resturant form " + e.target.postResturant.value);
    console.log("Review form " + e.target.postReview.value);

    var sendFeedback = {
      method: "POST",
      url: "https://serverless-hittgf4zcq-km.a.run.app/Feedback/SubmitReviews",
      headers: {
        "content-type": "application/json",
      },
      data: {
        Feedback: e.target.postReview.value,
        FoodItemName: e.target.postDish.value,
        ResturantName: e.target.postResturant.value,
      },
    };

    axios.request(sendFeedback).then(function (responseWDAWS) {
      var feedbackres = responseWDAWS.data;
      console.log("Feedback res: " + feedbackres);
      Swal.fire({
        icon: "success",
        title: "Feedback submitted",
        showConfirmButton: false,
        timer: 1500,
      });
    });
  };

  return (
    <div>
      <Meta title={pageTitle} />
      <Header head="Feedback" description="" style={{ align: "left" }} />

      <MenuCustomer></MenuCustomer>
      <Container>
        <Row className="justify-content-md-center">
          <Col xs lg="12">
            <Card className="mb-3">
              <Card.Header>Enter feedback</Card.Header>
              <Card.Body>
                <Form onSubmit={submitReview}>
                  <Form.Group controlId="NewPostTitle">
                    <Form.Label>Resturant name</Form.Label>
                    <Form.Control as="select" name="postResturant" required>
                      <option value="Tawa Naan">Tawa Naan</option>
                      <option value="Curry Grill">Curry Grill</option>
                      <option value="Masala Adda">Masala Adda</option>
                    </Form.Control>
                  </Form.Group>
                  <Form.Group controlId="NewPostTitle">
                    <Form.Label>Food Item</Form.Label>
                    <Form.Control
                      type="input"
                      name="postDish"
                      placeholder="Enter the food item name"
                      required
                      minLength="5"
                      onChange=""
                    />
                  </Form.Group>
                  <Form.Group controlId="NewPostTextArea">
                    <Form.Label>Enter your feedback</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      minLength="5"
                      name="postReview"
                      placeholder="enter feedback"
                      required
                      onChange=""
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
      </Container>
    </div>
  );
}

export default CustomerFeedback;
