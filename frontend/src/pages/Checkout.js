import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import Meta from "../components/Meta";
import MenuCustomer from "../components/MenuCustomer";
import MenuRestaurant from "../components/MenuRestaurant";
import Menu from "../components/Menu";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import axios from "axios";
import Cookies from "js-cookie";
import Card from "react-bootstrap/Card";
import Swal from "sweetalert2";
import { Interactions } from "aws-amplify";
import { useHistory, useParams, useLocation } from "react-router-dom";

// page content
const pageTitle = "HalifaxFoodie - Checkout";
const pageDescription = "Welcome to Halifax Foodie";

function Checkout(props) {
  const dynamoDbUserObj = JSON.parse(localStorage.getItem("dynamoDbObj"));
  const history = useHistory();
  const location = useLocation();
  let [checkOutItems, setCheckOutItems] = useState([]);
  let [total, setTotal] = useState(0);

  useEffect(async () => {
    let cart = location.state.cart;
    let mapKeys = Array.from(cart.keys());
    let tempCheckOutItems = [];
    let totalAmount = 0;
    mapKeys.forEach((element) => {
      tempCheckOutItems.push({
        title: element,
        quantity: cart.get(element).length,
        price: cart.get(element)[0]["price"] * cart.get(element).length,
      });
    });
    tempCheckOutItems.forEach((element) => {
      totalAmount += element["price"];
    });
    setCheckOutItems(tempCheckOutItems);
    setTotal(totalAmount);
  }, [location]);

  async function navigateToPage(event, page) {
    history.push("/" + page);
  }

  return (
    <div>
      <Meta title={pageTitle} />
      {dynamoDbUserObj && dynamoDbUserObj.usertype === "customer" ? (
        <MenuCustomer></MenuCustomer>
      ) : (
        <MenuRestaurant></MenuRestaurant>
      )}
      <Container className="add-margin-top">
        <Row className="justify-content-md-center">
          <Col xs lg="12">
            <Card className="mb-3">
              <Card.Header>
                <p className="message-header">
                  Your order is successfully placed
                </p>
              </Card.Header>
              <Card.Body>
                <table className="table-style">
                  <tbody>
                    <tr>
                      <th>Title</th>
                      <th>Quantity</th>
                      <th>Price</th>
                    </tr>
                    {checkOutItems.map((item, index) => {
                      return (
                        <tr key={index}>
                          <td>{item.title}</td>
                          <td>{item.quantity}</td>
                          <td>{item.price}</td>
                        </tr>
                      );
                    })}
                    <tr>
                      <td colSpan="3">Total Price Payable: {total}</td>
                    </tr>
                  </tbody>
                </table>
              </Card.Body>
              <div className="help-div">
                <Button
                  variant="primary"
                  className="help-button"
                  onClick={(event) => navigateToPage(event, "chat")}
                >
                  Talk to us
                </Button>
                <Button
                  variant="primary"
                  className="help-button"
                  onClick={(event) => navigateToPage(event, "support")}
                >
                  Need support ?
                </Button>
                <Button
                  variant="primary"
                  className="help-button"
                  onClick={(event) =>
                    navigateToPage(event, "customer/feedback")
                  }
                >
                  Give a feedback
                </Button>
              </div>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default Checkout;
