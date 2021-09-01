import React from "react";
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Redirect,
} from "react-router-dom";
import { LinkContainer } from "react-router-bootstrap";
import Cookies from "js-cookie";

import Footer from "./components/Footer";

import HomePage from "./pages/Home.js";
import SignupPage from "./pages/Signup.js";
import LoginPage from "./pages/Login.js";
import NotFoundPage from "./pages/NotFound.js";
import Logout from "./pages/Logout";

/*Bootstrap*/
import Container from "react-bootstrap/Container";

import "./styles/custom.css";
import CustomerDashboard from "./pages/customer/CustomerDashboard";
import RestaurantDashboard from "./pages/restaurant/RestaurantDashboard";
import RestuarantMenu from "./pages/restaurant/RestuarantMenu";
import Chat from "./pages/order/Chat";
import Support from "./pages/order/Support";
import Checkout from "./pages/Checkout";
import ForgotPassword from "./pages/ForgotPassword";

import Amplify from "aws-amplify";
import SecurityQuestions from "./pages/SecurityQuestions";
import ChangePassword from "./pages/ChangePassword";
import CustomerFeedback from "./pages/customer/CustomerFeedback";

Amplify.configure({
    Auth: {
        identityPoolId: "us-east-1:34a30a78-a48c-4bf7-bd00-f2675d8f8aad",
        region: "us-east-1",
    },
    Interactions: {
        bots: {
            HalifaxFoodiesSupport: {
                name: "HalifaxFoodiesSupport",
                alias: "$LATEST",
                region: "us-east-1",
            },
            HalifaxFoodieChat: {
                name: "HalifaxFoodieChat",
                alias: "$LATEST",
                region: "us-east-1",
            },
        },
    },
});

const validateAuth = (Component) => () => {
    return Cookies.get("auth_token") ? < Component / > : < Redirect to = "/login" / > ;
};

const App = () => ( <
    Router >
    <
    main className = "my-5 pt-3"
    style = {
        { minHeight: "80vh" } } >
    <
    Switch >
    <
    Route path = "/"
    component = { HomePage }
    exact / >
    <
    Route path = "/login"
    component = { LoginPage }
    /> <
    Route path = "/logout"
    component = { Logout }
    /> <
    Route path = "/signup"
    component = { SignupPage }
    /> <
    Route path = "/customer/dashboard"
    component = { CustomerDashboard } > < /Route> <
    Route path = "/customer/feedback"
    component = { CustomerFeedback } > < /Route> <
    Route path = "/restaurant/dashboard"
    component = { RestaurantDashboard } >
    < /Route> <
    Route path = "/chat" >
    <
    Chat / >
    <
    /Route> <
    Route path = "/support" >
    <
    Support / >
    <
    /Route> <
    Route path = "/menu/:id" >
    <
    RestuarantMenu / >
    <
    /Route> <
    Route path = "/checkout" >
    <
    Checkout / >
    <
    /Route> <
    Route path = "/forgotpassword"
    component = { ForgotPassword } > < /Route> <
    Route path = "/changepassword"
    component = { ChangePassword } > < /Route> <
    Route path = "/mfa"
    component = { SecurityQuestions } > < /Route> <
    Route component = { NotFoundPage }
    /> <
    /Switch> <
    /main> <
    Footer / >
    <
    /Router>
);

export default App;