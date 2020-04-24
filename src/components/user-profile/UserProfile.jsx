import React from "react";
import './user-profile.scss';
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
    FormGroup,
    Input,
    InputGroup,
    InputGroupAddon,
    InputGroupText,
    Modal,
    Row,
    Table,
    UncontrolledAlert,
    UncontrolledTooltip
} from "reactstrap";
import classnames from "classnames";

import HeaderNavbar from "../header-navbar/HeaderNavbar";

class UserProfile extends React.Component {
    state = {
        squares1to6: "",
        squares7and8: "",

        usernameValue: "",
        passwordValue: "",
        records: [],

        modal: {
            isEdit: false,
            recordId: -1,
            header: "",
            data: "",
            description: "",
        },

        recordModal: false,
        deleteModal: false,

        dangerNotification: false
    };

    aes256 = require('../crypto/aes256');
    params = require('../crypto/params');

    componentWillMount() {
        this.getUserProfile();
    }

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

    getUserProfile = () => {
        fetch('http://localhost:9080/user-profile/' + this.props.match.params.userId, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Session-Id': this.params.getSessionId()
            }
        })
            .then(response => {
                if (response.ok) {
                    response.json().then(data => {
                        let username = this.aes256(false, this.params.getSessionKey(), data.username);
                        let password = this.aes256(false, this.params.getSessionKey(), data.password);
                        this.setState({
                            usernameValue: username,
                            passwordValue: password,
                            records: data.records
                        })
                    });
                } else {
                    this.toggleNotification("dangerNotification");
                }
            })
            .catch(error => {
                this.toggleNotification("dangerNotification");
            })
    };

    saveRecord = (isEdit) => {
        let recordIdPath = isEdit
            ? '/record/' + this.state.modal.recordId
            : '/record';
        fetch('http://localhost:9080/user-profile/'
            + this.props.match.params.userId
            + recordIdPath,
            {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    header: this.state.modal.header,
                    description: this.state.modal.description,
                    data: this.state.modal.data
                })
            })
            .then(response => {
                if (response.ok) {
                    response.json().then((data) => {

                    })
                } else {
                    this.toggleNotification("dangerNotification");
                }
            })
            .catch(error => {
                this.toggleNotification("dangerNotification");
            })
    };

    addRecord = () => {
        let records = this.state.records;
        records.push(
            {
                header: this.state.modal.header,
                description: this.state.modal.description,
                data: this.state.modal.data,
                recordId: this.state.modal.recordId
            }
        )
        this.setState({
            records: records
        })
    }

    editRecord = () => {
        let records = this.state.records;
        records.forEach((record) => {
            if (record.header === this.state.modal.header) {
                record.header = this.state.modal.header;
                record.data = this.state.modal.data;
                record.description = this.state.modal.description;
            }
        });
        this.setState({
            records: records
        })
    }

    deleteRecord = (index) => {
        let records = this.state.records;
        records.slice(index, 1);
        this.setState({
            records: records
        })
    }

    resetModalState = () => {
        this.setState({
            modal: {
                isEdit: false,
                recordId: -1,
                header: "",
                data: "",
                description: "",
            }
        })
    }

    toggleModal = (modalState, isEdit, recordId) => {
        this.setState({
            modal: {
                ...this.state.modal,
                isEdit: isEdit,
                recordId: recordId
            },
            [modalState]: !this.state[modalState]
        })
    };

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
                                                            defaultValue={this.state.usernameValue}
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
                                                            defaultValue={this.state.passwordValue}
                                                            onFocus={e => this.setState({passwordFocus: true})}
                                                            onBlur={e => this.setState({
                                                                passwordFocus: false,
                                                                passwordValue: e.target.value
                                                            })}
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
                                                            onClick={() => {
                                                                this.toggleModal("recordModal");
                                                                this.resetModalState();
                                                            }}>
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
                                                        <th className="header">DESCRIPTION</th>
                                                        <th className="header">DATA</th>
                                                    </tr>
                                                    </thead>
                                                    <tbody>
                                                    {
                                                        this.state.records.map((record, i) =>
                                                            <tr>
                                                                <td>{record.header}</td>
                                                                <td>{record.description}</td>
                                                                <td>
                                                                    <div className="last-column">
                                                                        {record.data}
                                                                        <div className="edit-buttons">
                                                                            <Button id={"edit-btn-" + i}
                                                                                    className="btn-link"
                                                                                    color="info" size="sm"
                                                                                    onClick={() => this.toggleModal("recordModal", true, record.id)}>
                                                                                <i className="tim-icons icon-pencil"/>
                                                                            </Button>
                                                                            <UncontrolledTooltip
                                                                                placement="top"
                                                                                target={"edit-btn-" + i}>
                                                                                Edit record
                                                                            </UncontrolledTooltip>
                                                                            <Button id={"delete-btn-" + i}
                                                                                    className="btn-link"
                                                                                    color="danger" size="sm"
                                                                                    onClick={(e) => this.deleteRecord(i)}>
                                                                                <i className="tim-icons icon-simple-remove"/>
                                                                            </Button>
                                                                            <UncontrolledTooltip
                                                                                placement="top"
                                                                                target={"delete-btn-" + i}>
                                                                                Delete record
                                                                            </UncontrolledTooltip>
                                                                        </div>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        )
                                                    }
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
                            <h3 className="mb-0">{this.state.modal.isEdit ? "Edit" : "Add"} record</h3>
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
                                        defaultValue={this.state.modal.header}
                                        onFocus={e => this.setState({headerModalFocus: true})}
                                        onBlur={e => this.setState({
                                            headerModalFocus: false,
                                            modal: {
                                                ...this.state.modal,
                                                header: e.target.value
                                            }
                                        })}
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
                                        defaultValue={this.state.modal.description}
                                        onFocus={e => this.setState({descriptionModalFocus: true})}
                                        onBlur={e => this.setState({
                                            descriptionModalFocus: false,
                                            modal: {
                                                ...this.state.modal,
                                                description: e.target.value
                                            }
                                        })}
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
                                        defaultValue={this.state.modal.data}
                                        onFocus={e => this.setState({passwordModalFocus: true})}
                                        onBlur={e => this.setState({
                                            dataModalFocus: false,
                                            modal: {
                                                ...this.state.modal,
                                                data: e.target.value
                                            }
                                        })}
                                    />
                                </InputGroup>
                            </FormGroup>
                            <div className="text-center">
                                <Button className="btn-round" color="primary"
                                        type="button" size="lg"
                                        onClick={() => {
                                            //this.saveRecord();
                                            if (!this.state.modal.isEdit) {
                                                this.addRecord();
                                            } else {
                                                this.editRecord();
                                            }
                                            this.toggleModal("recordModal");
                                        }}>
                                    Save
                                </Button>
                            </div>
                        </Form>
                    </div>
                </Modal>
            </>
        );
    }
}

export default withRouter(withCookies(UserProfile));