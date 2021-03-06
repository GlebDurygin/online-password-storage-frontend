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

    params = require('../crypto/params');
    srpService = require('../crypto/SrpService');
    rsa = require('../crypto/rsa');
    aes256 = require('../crypto/aes256');
    utils = require('../crypto/utils');

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

    sendAuthenticationRequestToServer = () => {
        let emphaticKeyAValues = this.srpService.computeEmphaticKeyA();
        let dataKey = this.srpService.computeDataKey(this.state.passwordValue);
        let usernameEncrypted = this.utils.byteArrayToHex(this.aes256(true, dataKey, this.state.usernameValue));

        fetch('http://localhost:9080//sign-in-authentication', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: this.rsa(true, usernameEncrypted),
                emphaticKeyA: this.rsa(true, emphaticKeyAValues.emphaticKeyA)
            }),
            credentials: "include"
        })
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    this.toggleNotification("dangerNotification");
                }
            })
            .then(serverResponse => {
                this.sendCheckRequestToServer(emphaticKeyAValues, serverResponse, dataKey, usernameEncrypted);
            })
            .catch(error => {
                this.toggleNotification("dangerNotification");
            })
    };

    sendCheckRequestToServer = (emphaticKeyAValues, serverResponse, dataKey, usernameEncrypted) => {
        let salt = this.rsa(false, serverResponse.salt);
        let emphaticKeyB = this.rsa(false, serverResponse.emphaticKeyB);

        let maskValue = this.srpService.computeMaskValue(emphaticKeyAValues.emphaticKeyA, emphaticKeyB);
        let privateKey = this.srpService.computePrivateKey(salt,
            usernameEncrypted,
            this.state.passwordValue);
        let sessionKey = this.srpService.computeSessionKey(emphaticKeyB,
            emphaticKeyAValues.randomA,
            privateKey,
            maskValue);
        let clientCheckValue = this.srpService.computeClientCheckValue(usernameEncrypted,
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
                clientCheckValue: this.rsa(true, clientCheckValue)
            }),
            credentials: 'include'
        })
            .then(response => {
                if (response.ok) {
                    response.json().then(data => {
                        let computedServerCheckValue = this.srpService.computeServerCheckValue(
                            emphaticKeyAValues.emphaticKeyA.toString(),
                            clientCheckValue,
                            sessionKey);

                        let serverCheckValue = this.rsa(false, data.serverCheckValue);

                        if (computedServerCheckValue === serverCheckValue) {
                            let sessionId = this.srpService.computeSessionId(clientCheckValue, computedServerCheckValue, sessionKey);
                            this.params.setSessionKey(sessionKey);
                            this.params.setDataKey(dataKey);

                            this.props.cookies.set(this.params.sessionIdCookie, sessionId, {path: '/'});

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
                        let userId = this.aes256(false, this.params.getSessionKey(), data.userId);
                        this.props.history.push("/user-profile/" + userId);
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
                                                            this.sendAuthenticationRequestToServer(e)
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