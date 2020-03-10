import React from "react";
import './user-profile.scss';
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
    FormGroup,
    Input,
    InputGroup,
    InputGroupAddon,
    InputGroupText,
    Modal,
    Row,
    Table,
    UncontrolledTooltip
} from "reactstrap";
import classnames from "classnames";

import HeaderNavbar from "../header-navbar/HeaderNavbar";

class UserProfile extends React.Component {
    state = {
        squares1to6: "",
        squares7and8: "",
        recordModal: false,
        deleteModal: false
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

    toggleModal = modalState => {
        this.setState({
            [modalState]: !this.state[modalState]
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
                                    <Col className="offset-lg-0 offset-md-3 records" lg="5" md="6">
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
                                            <CardHeader className="records-title">
                                                <CardImg
                                                    alt="..."
                                                    src={require("../../img/square-purple-1.png")}
                                                />
                                                <CardTitle tag="h4">User profile</CardTitle>
                                            </CardHeader>
                                            <CardBody>
                                                <CardImg
                                                    alt="..."
                                                    src={require("../../img/square-purple-1.png")}
                                                    className="user-info"
                                                />
                                                <CardTitle tag="h4">User Info</CardTitle>
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
                                                <CardImg
                                                    alt="..."
                                                    src={require("../../img/square-purple-1.png")}
                                                    className="records-info"
                                                />
                                                <div className="records-table-header">
                                                    <CardTitle tag="h4">Records</CardTitle>
                                                    <Button id="add-btn" className="add-button btn-tooltip"
                                                            color="primary" type="button"
                                                            onClick={() => this.toggleModal("recordModal")}>
                                                        <i className="tim-icons icon-simple-add"/>
                                                    </Button>
                                                    <UncontrolledTooltip
                                                        delay={0}
                                                        placement="top"
                                                        target="add-btn"
                                                    >
                                                        Add record
                                                    </UncontrolledTooltip>
                                                </div>
                                                <Table className="tablesorter" responsive>
                                                    <thead className="text-primary">
                                                    <tr>
                                                        <th className="header">HEADER</th>
                                                        <th className="header">DATA</th>
                                                        <th className="header">DESCRIPTION</th>
                                                    </tr>
                                                    </thead>
                                                    <tbody>
                                                    <tr>
                                                        <td>BTC</td>
                                                        <td>7.342</td>
                                                        <td>
                                                            <div className="last-column">
                                                                48,870.75 USD
                                                                <div className="edit-buttons">
                                                                    <Button id="edit-btn-1"
                                                                            className="btn-link"
                                                                            color="info" size="sm"
                                                                            onClick={() => this.toggleModal("recordModal")}>
                                                                        <i className="tim-icons icon-pencil"/>
                                                                    </Button>
                                                                    <UncontrolledTooltip
                                                                        placement="top"
                                                                        target="edit-btn-1">
                                                                        Edit record
                                                                    </UncontrolledTooltip>
                                                                    <Button id="delete-btn-1"
                                                                            className="btn-link"
                                                                            color="danger" size="sm">
                                                                        <i className="tim-icons icon-simple-remove"/>
                                                                    </Button>
                                                                    <UncontrolledTooltip
                                                                        placement="top"
                                                                        target="delete-btn-1">
                                                                        Delete record
                                                                    </UncontrolledTooltip>
                                                                </div>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td>ETH</td>
                                                        <td>30.737</td>
                                                        <td>
                                                            <div className="last-column">
                                                                48,870.75 USD
                                                                <div className="edit-buttons">
                                                                    <Button id="edit-btn-2"
                                                                            className="btn-link"
                                                                            color="info" size="sm"
                                                                            onClick={() => this.toggleModal("recordModal")}>
                                                                        <i className="tim-icons icon-pencil"/>
                                                                    </Button>
                                                                    <UncontrolledTooltip
                                                                        placement="top"
                                                                        target="edit-btn-2">
                                                                        Edit record
                                                                    </UncontrolledTooltip>
                                                                    <Button id="delete-btn-2"
                                                                            className="btn-link"
                                                                            color="danger" size="sm">
                                                                        <i className="tim-icons icon-simple-remove"/>
                                                                    </Button>
                                                                    <UncontrolledTooltip
                                                                        placement="top"
                                                                        target="delete-btn-2">
                                                                        Delete record
                                                                    </UncontrolledTooltip>
                                                                </div>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td>XRP</td>
                                                        <td>19.242</td>
                                                        <td>
                                                            <div className="last-column">
                                                                48,870.75 USD
                                                                <div className="edit-buttons">
                                                                    <Button id="edit-btn-3"
                                                                            className="btn-link"
                                                                            color="info" size="sm"
                                                                            onClick={() => this.toggleModal("recordModal")}>
                                                                        <i className="tim-icons icon-pencil"/>
                                                                    </Button>
                                                                    <UncontrolledTooltip
                                                                        placement="top"
                                                                        target="edit-btn-3">
                                                                        Edit record
                                                                    </UncontrolledTooltip>
                                                                    <Button id="delete-btn-3"
                                                                            className="btn-link"
                                                                            color="danger" size="sm">
                                                                        <i className="tim-icons icon-simple-remove"/>
                                                                    </Button>
                                                                    <UncontrolledTooltip
                                                                        placement="top"
                                                                        target="delete-btn-3">
                                                                        Delete record
                                                                    </UncontrolledTooltip>
                                                                </div>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                    </tbody>
                                                </Table>
                                            </CardBody>
                                            <CardFooter/>
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

                <Modal
                    modalClassName="modal-black"
                    isOpen={this.state.recordModal}
                    toggle={() => this.toggleModal("recordModal")}>
                    <div className="modal-header justify-content-center">
                        <button className="close"
                                onClick={() => this.toggleModal("recordModal")}>
                            <i className="tim-icons icon-simple-remove text-white"/>
                        </button>
                        <div className="text-muted text-center ml-auto mr-auto">
                            <h3 className="mb-0">Add record</h3>
                        </div>
                    </div>
                    <div className="modal-body">
                        <Form role="form">
                            <FormGroup className="mb-3">
                                <InputGroup
                                    className={classnames("input-group-alternative", {
                                        "input-group-focus": this.state.headerModalFocus
                                    })}
                                >
                                    <InputGroupAddon addonType="prepend">
                                        <InputGroupText>
                                            <i className="tim-icons icon-tag"/>
                                        </InputGroupText>
                                    </InputGroupAddon>
                                    <Input
                                        placeholder="Header"
                                        type="text"
                                        onFocus={e => this.setState({headerModalFocus: true})}
                                        onBlur={e => this.setState({headerModalFocus: false})}
                                    />
                                </InputGroup>
                            </FormGroup>
                            <FormGroup className="mb-3">
                                <InputGroup
                                    className={classnames("input-group-alternative", {
                                        "input-group-focus": this.state.descriptionModalFocus
                                    })}
                                >
                                    <InputGroupAddon addonType="prepend">
                                        <InputGroupText>
                                            <i className="tim-icons icon-notes"/>
                                        </InputGroupText>
                                    </InputGroupAddon>
                                    <Input
                                        placeholder="Description"
                                        type="text"
                                        onFocus={e => this.setState({descriptionModalFocus: true})}
                                        onBlur={e => this.setState({descriptionModalFocus: false})}
                                    />
                                </InputGroup>
                            </FormGroup>
                            <FormGroup>
                                <InputGroup
                                    className={classnames("input-group-alternative", {
                                        "input-group-focus": this.state.passwordModalFocus
                                    })}
                                >
                                    <InputGroupAddon addonType="prepend">
                                        <InputGroupText>
                                            <i className="tim-icons icon-key-25"/>
                                        </InputGroupText>
                                    </InputGroupAddon>
                                    <Input
                                        placeholder="Password"
                                        type="text"
                                        onFocus={e => this.setState({passwordModalFocus: true})}
                                        onBlur={e => this.setState({passwordModalFocus: false})}
                                    />
                                </InputGroup>
                            </FormGroup>
                            <div className="text-center">
                                <Button className="btn-round" color="primary"
                                        type="button" size="lg">
                                    Add record
                                </Button>
                            </div>
                        </Form>
                    </div>
                </Modal>
            </>
        );
    }
}

export default withRouter(UserProfile);