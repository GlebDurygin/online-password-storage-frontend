import React from "react";
import './sign-up.scss';
import classnames from "classnames";
import {withRouter} from "react-router-dom";
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
    Row
} from "reactstrap";
import HeaderNavbar from "../header-navbar/HeaderNavbar";

class SignUp extends React.Component {
    state = {
        squares1to6: "",
        squares7and8: ""
    };

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
                                            <CardHeader className="sign-up-title">
                                                <CardImg
                                                    alt="..."
                                                    src={require("../../img/square-purple-1.png")}
                                                />
                                                <CardTitle tag="h4">Sign Up</CardTitle>
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
                                                                this.setState({usernameFocus: false})
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
                                                            onBlur={e => this.setState({passwordFocus: false})}
                                                        />
                                                    </InputGroup>
                                                    <InputGroup
                                                        className={classnames({
                                                            "input-group-focus": this.state.keywordFocus
                                                        })}
                                                    >
                                                        <InputGroupAddon addonType="prepend">
                                                            <InputGroupText>
                                                                <i className="tim-icons icon-alert-circle-exc"/>
                                                            </InputGroupText>
                                                        </InputGroupAddon>
                                                        <Input
                                                            placeholder="Keyword"
                                                            type="text"
                                                            onFocus={e =>
                                                                this.setState({keywordFocus: true})
                                                            }
                                                            onBlur={e =>
                                                                this.setState({keywordFocus: false})
                                                            }
                                                        />
                                                    </InputGroup>
                                                </Form>
                                            </CardBody>
                                            <CardFooter>
                                                <Button className="btn-round" color="primary" size="lg">
                                                    Sign up
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
                    {/*<Footer />*/}
                </div>
            </>
        );
    }
}

export default withRouter(SignUp);