import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import Header from "../components/Header";
import Meta from "../components/Meta";
import Menu from "../components/Menu";
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
const pageTitle = "Login";
const pageDescription = "Welcome to HalifaxFoodie";

function Login() {
  const history = useHistory();
  const [success, setSuccess] = useState("");
  const [errors, setErrors] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    // console.log({
    //   email: data.get("email"),
    //   password: data.get("password"),
    // });

    const reqObj = { email: data.get("email"), password: data.get("password") };
    const conf = {
      headers: {
        authtoken: "YXNzaWdubWVudDJzZXJ2ZXJsZXNz",
      },
    };
    const submitLogin = async () => {
      //loginaxios request to backend
      firebaseAuthObj
        .signInWithEmailAndPassword(reqObj.email, reqObj.password)
        .then((userCredential) => {
          // result.user.tenantId should be ‘TENANT_PROJECT_ID’.
          var user = userCredential.user;
          console.log(user);
          console.log(user.emailVerified);
          console.table(user);
          if (user.emailVerified) {
            //send axios to dynamodb for type of user
            setSuccess("");
            setErrors("");
            localStorage.setItem("user", JSON.stringify(user));
            history.push("/mfa");
          } else {
            setSuccess("");
            setErrors("Login Failed!!! Email is not verified");
            Swal.fire({
              icon: "warning",
              title: "Login Failed!!! Email is not verified",
              showConfirmButton: false,
              timer: 1500,
            });
          }
        })
        .catch((error) => {
          // Handle error.
          console.log(error.code);
          if (error.code === "auth/wrong-password") {
            setSuccess("");
            setErrors("Invalid Password!!!!");
          } else {
          }
          setSuccess("");
          setErrors("Connection to server failed!!!");
          console.log(error);
        });
    };
    submitLogin();
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
      <Meta title="HalifaxFoodie - Login" />
      <Header head={pageTitle} description={pageDescription} />
      <Menu></Menu>
      <Container>
        <Row className="justify-content-md-center">
          <Col xs lg="6">
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="email">
                <Form.Label>Email address</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Enter email"
                  name="email"
                  required
                />
                <Form.Text className="text-muted"></Form.Text>
              </Form.Group>

              <Form.Group controlId="password">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  name="password"
                  placeholder="Password"
                  required
                  title="password must contain at least one number and one uppercase and lowercase letter, and minimum length is 8 characters"
                />
                <br></br>
                {displayErrors() ? (
                  <Alert variant="danger">{errors}</Alert>
                ) : (
                  ""
                )}
              </Form.Group>
              <a href="/forgotpassword" style={{ float: "right" }}>
                Forgot Password?
              </a>
              {/* <Form.Group controlId="formBasicCheckbox">
                  <Form.Check type="checkbox" label="Remember me" />
                </Form.Group> */}
              <br></br>
              <Button variant="primary" type="submit">
                Log in
              </Button>
            </Form>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default Login;
