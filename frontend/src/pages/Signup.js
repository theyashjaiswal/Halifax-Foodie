import React, { useState } from "react";
import Header from "../components/Header";
import Meta from "../components/Meta";
import Menu from "../components/Menu";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import axios from "axios";
import Swal from "sweetalert2";
import { useHistory } from "react-router-dom";
import { Alert } from "react-bootstrap";
import { firebaseAuthObj } from "../config/firebaseConfig";

// page content
const pageTitle = "Signup";
const pageDescription = "Welcome to HalifaxFoodie";

function Signup() {
  const history = useHistory();
  const [validName, setvalidName] = useState(true);
  const [validPassword, setvalidPassword] = useState(true);
  const [pass, setPassword] = useState();
  const [validConfirm, setvalidConfirm] = useState(true);
  const [errors, setErrors] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("submitting");
    const data = new FormData(event.currentTarget);
    // console.log({
    //   fullname: data.get("fullName"),
    //   email: data.get("email"),
    //   password: data.get("password"),
    //   topic: data.get("topic"),
    // });
    const reqObj = {
      fullname: data.get("name"),
      email: data.get("email"),
      password: data.get("password"),
      usertype: data.get("usertype"),
      question1: data.get("securityquestionone"),
      question2: data.get("securityquestiontwo"),
      answer1: data.get("answer1"),
      answer2: data.get("answer2"),
    };
    console.table(reqObj);
    const api_url =
      "https://our5k2sjua.execute-api.us-east-1.amazonaws.com/PROD/registerUser";
    const conf = {
      headers: {
        "x-api-key": "86rdg0XPVu7niqEOb9EFP2BFAi5l5QIe9b8ugAd3",
        "content-type": "application/json",
      },
    };
    const submitRegistration = async () => {
      if (validPassword && validConfirm) {
        if (
          reqObj.question1 === "Choose your security question..." ||
          reqObj.question2 === "Choose your security question..."
        ) {
          setErrors("Please choose the security questions!!!");
          Swal.fire({
            icon: "warning",
            title: "Please choose the security questions",
            showConfirmButton: false,
            timer: 1500,
          });
        } else {
          setErrors("");
          setSuccess("");

          //send axios to backend api deployed on lambda
          firebaseAuthObj
            .createUserWithEmailAndPassword(reqObj.email, reqObj.password)
            .then((userCredential) => {
              // Signed in
              var user = userCredential.user;
              console.log(user);
              firebaseAuthObj
                .signInWithEmailAndPassword(reqObj.email, reqObj.password)
                .then((result) => {
                  // result.user.tenantId should be ‘TENANT_PROJECT_ID’.
                  firebaseAuthObj.currentUser
                    .sendEmailVerification()
                    .then(() => {
                      // Email verification sent!
                      console.log(user.uid);
                      console.log(reqObj.fullname);
                      const userObj = {
                        userid: user.uid,
                        usertype: reqObj.usertype,
                        email: reqObj.email,
                        name: reqObj.fullname,
                        question1: reqObj.question1,
                        answer1: reqObj.answer1,
                        question2: reqObj.question2,
                        answer2: reqObj.answer2,
                      };
                      console.table(userObj);
                      axios.post(api_url, userObj, conf).then((response) => {
                        var responseUpload = response;
                        console.log("resbody" + responseUpload);

                        if (
                          responseUpload.data === "user created successfully!!"
                        ) {
                          setSuccess("");
                          setErrors("");
                          Swal.fire({
                            icon: "success",
                            title:
                              "Verification email sent!! Please check your inbox.",
                            showConfirmButton: false,
                            timer: 1500,
                          });
                          window.location.reload(false);
                        } else {
                          setErrors("Connection to server failed!!!");
                          Swal.fire({
                            icon: "warning",
                            title: "Connection to server failed!!!",
                            showConfirmButton: false,
                            timer: 1500,
                          });
                        }
                      });
                    });
                })
                .catch((error) => {
                  // Handle error.
                  setSuccess("");
                  setErrors("Connection to server failed!!!");
                  console.log(error);
                });
            })
            .catch((error) => {
              var errorCode = error.code;
              var errorMessage = error.message;
              console.log(errorMessage, errorCode, error);
              if (
                errorCode === "auth/email-already-in-use" &&
                errorMessage ===
                  "The email address is already in use by another account."
              ) {
                setSuccess("");
                setErrors("User already exists!!!!");
                Swal.fire({
                  icon: "error",
                  title: "User already exists!!!!",
                  showConfirmButton: false,
                  timer: 1500,
                });

                console.log(error);
              } else {
                setSuccess("");
                setErrors("Connection to server failed!!!");
                console.log(error);
              }
            });
        }
      } else {
        setErrors("Passwords do no match!!");
      }
    };
    submitRegistration();
  };

  const handleLoginClick = () => {
    // history.push("/signin");
  };

  const validatePass = (event) => {
    event.preventDefault();
    // console.log(event.currentTarget.value);
    //validpasslinkreference-https://stackoverflow.com/a/19605207/16122497
    var reg = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;
    var res = reg.test(event.currentTarget.value);
    if (res) {
      setPassword(event.currentTarget.value);
      setvalidPassword(true);
    } else {
      setvalidPassword(false);
    }
    console.log(validPassword);
  };

  const validateConfirm = (event) => {
    event.preventDefault();
    console.log("confirm pass", event.currentTarget.value);
    console.log("ogpass", pass);
    if (pass === event.currentTarget.value) {
      setvalidConfirm(true);
    } else {
      setvalidConfirm(false);
    }
  };

  const validateName = (event) => {
    event.preventDefault();
    // console.log(event.currentTarget.value);
    if (event.currentTarget.value.length >= 2) {
      setvalidName(true);
    } else {
      setvalidName(false);
    }
    // console.log(validName);
  };

  const displayErrors = () => {
    if (errors !== "") {
      return true;
    } else {
      return false;
    }
  };

  const displaySuccess = () => {
    if (success !== "") {
      return true;
    } else {
      return false;
    }
  };
  return (
    <div>
      <Meta title={pageTitle} />
      <Header head={pageTitle} description={pageDescription} />
      <Menu></Menu>
      <Container>
        <Row className="justify-content-md-center">
          <Col xs lg="6">
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="name">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter Name"
                  name="name"
                  required
                  minLength="2"
                />
                <Form.Text className="text-muted"></Form.Text>
              </Form.Group>
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
                  placeholder="Password"
                  name="password"
                  // minLength="8"
                  pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
                  title="Password Validation Error!!! must contain at least one number and one uppercase and lowercase letter, and minimum length is 8 characters"
                  required
                  onChange={validatePass}
                />
              </Form.Group>
              <Form.Group controlId="confirmpassword">
                <Form.Label>Confirm Password</Form.Label>
                <Form.Control
                  type="password"
                  name="confirmpassword"
                  placeholder="Confirm Password"
                  minLength="8"
                  required
                  pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
                  title="Password Validation Error!!! must contain at least one number and one uppercase and lowercase letter, and minimum length is 8 characters"
                  onChange={validateConfirm}
                />
              </Form.Group>
              <Form.Group controlId="usertype">
                <Form.Label>User Type</Form.Label>
                <Form.Control as="select" custom required name="usertype">
                  <option value="customer">Customer</option>
                  <option value="restaurant">Restaurant</option>
                </Form.Control>
              </Form.Group>
              <Form.Group controlId="securityquestionone">
                <Form.Label>Security Question 1</Form.Label>
                <Form.Control
                  as="select"
                  custom
                  required
                  name="securityquestionone"
                >
                  <option>Choose your security question...</option>
                  <option value="What city were you born in?">
                    What city were you born in?
                  </option>
                  <option value="What was the first concert you attended?">
                    What was the first concert you attended?
                  </option>
                  <option value="What was your childhood nickname?">
                    What was your childhood nickname?
                  </option>
                  <option value="What was the make and model of your first car?">
                    What was the make and model of your first car?
                  </option>
                </Form.Control>

                <Form.Group controlId="answer1">
                  <Form.Label>Answer 1</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Answer your security question #1"
                    name="answer1"
                    required
                    minLength="2"
                  />
                  <Form.Text className="text-muted"></Form.Text>
                </Form.Group>
              </Form.Group>
              <Form.Group controlId="securityquestiontwo">
                <Form.Label>Security Question 2</Form.Label>
                <Form.Control
                  as="select"
                  custom
                  required
                  name="securityquestiontwo"
                >
                  <option>Choose your security question...</option>
                  <option value="In what city did you meet your first spouse/partner?">
                    In what city did you meet your first spouse/partner?
                  </option>
                  <option value="In what city was your first job?">
                    In what city was your first job?
                  </option>
                  <option value="Who is the most famous person you have ever met?">
                    Who is the most famous person you have ever met?
                  </option>
                  <option value="  What was the name of your first pet?">
                    What was the name of your first pet?
                  </option>
                </Form.Control>

                <Form.Group controlId="answer2">
                  <Form.Label>Answer 2</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Answer your security question #2"
                    name="answer2"
                    required
                    minLength="2"
                  />
                  <Form.Text className="text-muted"></Form.Text>
                </Form.Group>
              </Form.Group>
              <Form.Group controlId="checkbox">
                <Form.Check
                  type="checkbox"
                  label="I Agree to the Terms & Conditions"
                  required
                />
              </Form.Group>
              <br></br>
              {displayErrors() ? <Alert variant="danger">{errors}</Alert> : ""}
              <Button variant="primary" type="submit">
                Sign up
              </Button>
            </Form>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default Signup;
