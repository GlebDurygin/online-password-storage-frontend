import React from "react";
import './records.scss';
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
    Row,
    Table
} from "reactstrap";

// core components
//import ExamplesNavbar from "components/Navbars/ExamplesNavbar.jsx";
//import Footer from "components/Footer/Footer.jsx";

class Records extends React.Component {
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
                {/*<ExamplesNavbar />*/}
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
                                                <CardTitle tag="h4">Records</CardTitle>
                                            </CardHeader>
                                            <CardBody>
                                                <Table className="tablesorter" responsive>
                                                    <thead className="text-primary">
                                                    <tr>
                                                        <th className="header">HEADER</th>
                                                        <th className="header">DATA</th>
                                                        <th className="header">DESCRIPTION</th>
                                                        <th className="header">EDIT</th>
                                                        <th className="header">DELETE</th>
                                                    </tr>
                                                    </thead>
                                                    <tbody>
                                                    <tr>
                                                        <td>BTC</td>
                                                        <td>7.342</td>
                                                        <td>48,870.75 USD</td>
                                                        <td>
                                                            <Button className="btn-link" color="info" size="sm">
                                                                <i className="tim-icons icon-pencil"/>
                                                            </Button>
                                                        </td>
                                                        <td>
                                                            <Button className="btn-link" color="danger" size="sm">
                                                                <i className="tim-icons icon-simple-remove"/>
                                                            </Button>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td>ETH</td>
                                                        <td>30.737</td>
                                                        <td>64,53.30 USD</td>
                                                        <td>
                                                            <Button className="btn-link" color="info" size="sm">
                                                                <i className="tim-icons icon-pencil"/>
                                                            </Button>
                                                        </td>
                                                        <td>
                                                            <Button className="btn-link" color="danger" size="sm">
                                                                <i className="tim-icons icon-simple-remove"/>
                                                            </Button>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td>XRP</td>
                                                        <td>19.242</td>
                                                        <td>18,354.96 USD</td>
                                                        <td>
                                                            <Button className="btn-link" color="info" size="sm">
                                                                <i className="tim-icons icon-pencil"/>
                                                            </Button>
                                                        </td>
                                                        <td>
                                                            <Button className="btn-link" color="danger" size="sm">
                                                                <i className="tim-icons icon-simple-remove"/>
                                                            </Button>
                                                        </td>
                                                    </tr>
                                                    </tbody>
                                                </Table>
                                            </CardBody>
                                            <CardFooter>
                                                <Button className="btn-round" color="primary" size="lg">
                                                    Add
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

export default withRouter(Records);