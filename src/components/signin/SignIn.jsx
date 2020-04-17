import React from "react";
import './sign-in.scss';
import classnames from "classnames";
import {withRouter} from "react-router-dom";
import {withCookies} from "react-cookie";
// reactstrap components
import {
    Button,
    Card,
    CardBody,
    CardFooter,
    CardHeader,
    CardImg,
    CardTitle,
    Col,
    Container,
    Form,
    Input,
    InputGroup,
    InputGroupAddon,
    InputGroupText,
    Row,
    UncontrolledAlert
} from "reactstrap";
import HeaderNavbar from "../header-navbar/HeaderNavbar";

class SignIn extends React.Component {
    state = {
        squares1to6: "",
        squares7and8: "",

        usernameValue: "",
        passwordValue: "",

        dangerNotification: false
    };

    cipher = require('../crypto/rc4');
    params = require('../crypto/params');
    srpService = require('../crypto/SrpService');

    componentDidMount() {
        document.body.classList.toggle("register-page");
        document.documentElement.addEventListener("mousemove", this.followCursor);
    }

    componentWillUnmount() {
        document.body.classList.toggle("register-page");
        document.documentElement.removeEventListener(
            "mousemove",
            this.followCursor
        );
    }

    followCursor = event => {
        let posX = event.clientX - window.innerWidth / 2;
        let posY = event.clientY - window.innerWidth / 6;
        this.setState({
            squares1to6:
                "perspective(500px) rotateY(" +
                posX * 0.05 +
                "deg) rotateX(" +
                posY * -0.05 +
                "deg)",
            squares7and8:
                "perspective(500px) rotateY(" +
                posX * 0.02 +
                "deg) rotateX(" +
                posY * -0.02 +
                "deg)"
        });
    };

    sendAuthorizationRequestToServer = () => {
        let emphaticKeyAValues = this.srpService.computeEmphaticKeyA();

        fetch('http://localhost:9080//sign-in-authorization', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: this.cipher(true, this.params.anonymousKey, this.state.usernameValue),
                emphaticKeyA: this.cipher(true, this.params.anonymousKey, emphaticKeyAValues.emphaticKeyA)
            })
        })
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    this.toggleNotification("dangerNotification");
                }
            })
            .then(serverResponse => {
                this.sendCheckRequestToServer(emphaticKeyAValues, serverResponse);
            })
            .catch(error => {
                this.toggleNotification("dangerNotification");
            })
    };

    sendCheckRequestToServer = (emphaticKeyAValues, serverResponse) => {
        let authorizationKey = this.props.cookies.get('SESSION_KEY');
        let salt = this.cipher(false, authorizationKey, serverResponse.salt);
        let emphaticKeyB = this.cipher(false, authorizationKey, serverResponse.emphaticKeyB);

        let maskValue = this.srpService.computeMaskValue(emphaticKeyAValues.emphaticKeyA, emphaticKeyB);
        let privateKey = this.srpService.computePrivateKey(salt,
            this.state.usernameValue,
            this.state.passwordValue);
        let sessionKey = this.srpService.computeSessionKey(emphaticKeyB,
            emphaticKeyAValues.randomA,
            privateKey,
            maskValue);
        let clientCheckValue = this.srpService.computeClientCheckValue(this.state.usernameValue,
            salt,
            emphaticKeyAValues.emphaticKeyA.toString(),
            emphaticKeyB,
            sessionKey);

        fetch('http://localhost:9080//sign-in-check', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                clientCheckValue: this.cipher(true, authorizationKey, clientCheckValue)
            }),
            credentials: 'include'
        })
            .then(response => {
                if (response.ok) {
                    response.json().then(data => {
                        let serverCheckValue = this.srpService.computeServerCheckValue(
                            emphaticKeyAValues.emphaticKeyA.toString(),
                            clientCheckValue,
                            sessionKey);

                        if (serverCheckValue === data.serverCheckValue) {
                            this.props.cookies.set('SESSION_KEY', sessionKey);
                            this.sendGetUserProfileRequest();
                        } else {
                            this.toggleNotification("dangerNotification");
                        }
                    });
                } else {
                    this.toggleNotification("dangerNotification");
                }
            })
            .catch(error => {
                this.toggleNotification("dangerNotification");
            })
    };

    sendGetUserProfileRequest = () => {
        fetch('http://localhost:9080//user-profile', {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        })
            .then(response => {
                if (response.ok) {
                    response.json().then(data => {
                        this.props.history.push("/user-profile/" + data.userId);
                    });
                } else {
                    this.toggleNotification("dangerNotification");
                }
            })
            .catch(error => {
                this.toggleNotification("dangerNotification");
            })
    }

    toggleNotification = notificationState => {
        this.setState({
            [notificationState]: !this.state[notificationState]
        })
    };

    render() {
        return (
            <>
                <HeaderNavbar/>
                <div className="wrapper">
                    <div className="page-header">
                        <div className="page-header-image"/>
                        <div className="content">
                            <Container>
                                <Row>
                                    <Col className="offset-lg-0 offset-md-3" lg="5" md="6">
                                        <div
                                            className="square square-7"
                                            id="square7"
                                            style={{transform: this.state.squares7and8}}
                                        />
                                        <div
                                            className="square square-8"
                                            id="square8"
                                            style={{transform: this.state.squares7and8}}
                                        />
                                        <Card className="card-register">
                                            <CardHeader>
                                                <CardImg
                                                    alt="..."
                                                    src={require("../../img/square-purple-1.png")}
                                                />
                                                <CardTitle tag="h4">Sign In</CardTitle>
                                                <UncontrolledAlert className="alert-with-icon" color="danger"
                                                                   isOpen={this.state.dangerNotification}
                                                                   toggle={() => this.toggleNotification("dangerNotification")}>
                                                    <span data-notify="icon"
                                                          className="tim-icons icon-alert-circle-exc"/>
                                                    <span>
                                                        <b>Alert! </b> <br/>
                                                        An error has occurred
                                                    </span>
                                                </UncontrolledAlert>
                                            </CardHeader>
                                            <CardBody>
                                                <Form className="form">
                                                    <InputGroup
                                                        className={classnames({
                                                            "input-group-focus": this.state.usernameFocus
                                                        })}
                                                    >
                                                        <InputGroupAddon addonType="prepend">
                                                            <InputGroupText>
                                                                <i className="tim-icons icon-single-02"/>
                                                            </InputGroupText>
                                                        </InputGroupAddon>
                                                        <Input
                                                            placeholder="Username"
                                                            type="text"
                                                            onFocus={e =>
                                                                this.setState({usernameFocus: true})
                                                            }
                                                            onBlur={e =>
                                                                this.setState({
                                                                    usernameFocus: false,
                                                                    usernameValue: e.target.value
                                                                })
                                                            }
                                                        />
                                                    </InputGroup>
                                                    <InputGroup
                                                        className={classnames({
                                                            "input-group-focus": this.state.passwordFocus
                                                        })}
                                                    >
                                                        <InputGroupAddon addonType="prepend">
                                                            <InputGroupText>
                                                                <i className="tim-icons icon-lock-circle"/>
                                                            </InputGroupText>
                                                        </InputGroupAddon>
                                                        <Input
                                                            placeholder="Password"
                                                            type="password"
                                                            onFocus={e => this.setState({passwordFocus: true})}
                                                            onBlur={e => this.setState({
                                                                passwordFocus: false,
                                                                passwordValue: e.target.value
                                                            })}
                                                        />
                                                    </InputGroup>
                                                </Form>
                                            </CardBody>
                                            <CardFooter>
                                                <Button className="btn-round" color="primary" size="lg"
                                                        onClick={e =>
                                                            this.sendAuthorizationRequestToServer(e)
                                                        }>
                                                    Sign in
                                                </Button>
                                            </CardFooter>
                                        </Card>
                                    </Col>
                                </Row>
                                <div className="register-bg"/>
                                <div
                                    className="square square-1"
                                    id="square1"
                                    style={{transform: this.state.squares1to6}}
                                />
                                <div
                                    className="square square-2"
                                    id="square2"
                                    style={{transform: this.state.squares1to6}}
                                />
                                <div
                                    className="square square-3"
                                    id="square3"
                                    style={{transform: this.state.squares1to6}}
                                />
                                <div
                                    className="square square-4"
                                    id="square4"
                                    style={{transform: this.state.squares1to6}}
                                />
                                <div
                                    className="square square-5"
                                    id="square5"
                                    style={{transform: this.state.squares1to6}}
                                />
                                <div
                                    className="square square-6"
                                    id="square6"
                                    style={{transform: this.state.squares1to6}}
                                />
                            </Container>
                        </div>
                    </div>
                </div>
            </>
        );
    }
}

export default withRouter(withCookies(SignIn));