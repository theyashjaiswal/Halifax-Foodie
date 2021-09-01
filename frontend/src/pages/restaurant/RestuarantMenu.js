import React, { useState, useEffect } from "react";
import Header from "../../components/Header";
import Meta from "../../components/Meta";
import MenuCustomer from "../../components/MenuCustomer";
import MenuRestaurant from "../../components/MenuRestaurant";
import Menu from "../../components/Menu";
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
import { useHistory, useParams } from "react-router-dom";

// page content
const pageTitle = "HalifaxFoodie - Menu";
const pageDescription = "Welcome to Halifax Foodie";

function RestuarantMenu() {
  const dynamoDbUserObj = JSON.parse(localStorage.getItem("dynamoDbObj"));
  const history = useHistory();
  const params = useParams();
  let cart = new Map();
  const [checkout, setCheckout] = useState(false);
  let [menuItems, setMenuItems] = useState([]);

  useEffect(async () => {
    let id = params.id;
    let resp = await axios.get(
      "https://us-central1-csci5410-316320.cloudfunctions.net/hfx-foodie-sapp2-get?restaurant_id=" +
        id
    );
    let tempItems = resp["data"]["data"][0];
    tempItems.forEach((element) => {
      element["price"] = 50.0;
    });
    setMenuItems(tempItems);
  }, []);

  async function addInCart(event, item) {
    if (
      cart.get(item["title"]) == undefined ||
      cart.get(item["title"]) == null
    ) {
      cart.set(item["title"], [item]);
    } else {
      let temp = cart.get(item["title"]);
      temp.push(item);
      cart.set(item["title"], temp);
    }
    setCheckout(true);
  }

  function navigateToCheckout(e) {
    history.push("/checkout", { cart });
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
                <p className="message-header">Restuarant Menu</p>
              </Card.Header>
              <Card.Body>
                <table className="table-style">
                  <tbody>
                    <tr>
                      <th>Dish</th>
                      <th>Title</th>
                      <th>Description</th>
                      <th>Price</th>
                      <th>Action</th>
                    </tr>
                    {menuItems.map((item, index) => {
                      return (
                        <tr key={index}>
                          <td>
                            <img src={item.thumbnail} className="food-img" />
                          </td>
                          <td className="text-align-justify">{item.title}</td>
                          <td className="text-align-justify">
                            {item.description}
                          </td>
                          <td>{item.price}</td>
                          <td>
                            <Button
                              style={{ float: "right" }}
                              variant="primary"
                              onClick={(event) => addInCart(event, item)}
                            >
                              Add
                            </Button>
                          </td>
                        </tr>
                      );
                    })}
                    {checkout ? (
                      <tr>
                        <td colSpan="5">
                          <Button
                            style={{ float: "right" }}
                            variant="primary"
                            onClick={navigateToCheckout}
                          >
                            Proceed to Checkout
                          </Button>
                        </td>
                      </tr>
                    ) : (
                      <tr>
                        <td colSpan="5"></td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default RestuarantMenu;
