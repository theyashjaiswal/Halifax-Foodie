import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import Header from "../components/Header";
import Meta from "../components/Meta";
import MenuCustomer from "../components/MenuCustomer";
import MenuRestaurant from "../components/MenuRestaurant";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import axios from "axios";
import Swal from "sweetalert2";
import { Alert } from "react-bootstrap";
import { firebaseAuthObj } from "../config/firebaseConfig";
// page content
const pageTitle = "";
const pageDescription = "Change Password";

function ChangePassword() {
  const dynamoDbUserObj = JSON.parse(localStorage.getItem("dynamoDbObj"));
  const history = useHistory();
  const [errors, setErrors] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    // console.log({
    //   email: data.get("email"),
    //   password: data.get("password"),
    // });

    const reqObj = { email: data.get("email") };
    const conf = {
      headers: {
        authtoken: "YXNzaWdubWVudDJzZXJ2ZXJsZXNz",
      },
    };
    const sendPasswordResestLink = async () => {
      //loginaxios request to backend
      firebaseAuthObj
        .sendPasswordResetEmail(reqObj.email)
        .then(() => {
          // Password reset email sent!
          setSuccess("");
          setErrors("");
          Swal.fire({
            icon: "success",
            title: "Update password link has been sent to your mailbox.",
            showConfirmButton: false,
            timer: 1500,
          });
          if (dynamoDbUserObj && dynamoDbUserObj.usertype === "customer") {
            history.push("/customer/dashboard");
          } else {
            history.push("restaurant/dashboard");
          }
        })
        .catch((error) => {
          var errorCode = error.code;
          var errorMessage = error.message;
          setSuccess("");
          setErrors("Request Failed!! Please check your email ID!!");
          Swal.fire({
            icon: "error",
            title: "Request Failed!! Please check your email ID!!",
            showConfirmButton: false,
            timer: 1500,
          });
        });
    };
    sendPasswordResestLink();
  };

  const displayErrors = () => {
    if (errors !== "") {
      return true;
    } else {
      return false;
    }
  };

  return (
    <div>
      <Meta title="HalifaxFoodie - Forgot Password" />
      <Header head={pageTitle} description={pageDescription} />
      {dynamoDbUserObj && dynamoDbUserObj.usertype === "customer" ? (
        <MenuCustomer></MenuCustomer>
      ) : (
        <MenuRestaurant></MenuRestaurant>
      )}
      <Container>
        <Row className="justify-content-md-center">
          <Col xs lg="6">
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="email">
                <Form.Label>Password reset link</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Enter your email address to get the link to update your password"
                  name="email"
                  required
                />
                <Form.Text className="text-muted"></Form.Text>
              </Form.Group>
              {displayErrors() ? <Alert variant="danger">{errors}</Alert> : ""}

              <Button
                variant="primary"
                type="submit"
                style={{ float: "right" }}
              >
                Submit
              </Button>
            </Form>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default ChangePassword;
