import React from "react";
import './header-navbar.scss';
import {Link} from "react-router-dom";
// reactstrap components
import {Container, Nav, Navbar, NavbarBrand, NavItem, NavLink} from "reactstrap";

class HeaderNavbar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            collapseOpen: false,
            color: "navbar-transparent"
        };
    }

    componentDidMount() {
        window.addEventListener("scroll", this.changeColor);
    }

    componentWillUnmount() {
        window.removeEventListener("scroll", this.changeColor);
    }

    changeColor = () => {
        if (
            document.documentElement.scrollTop > 99 ||
            document.body.scrollTop > 99
        ) {
            this.setState({
                color: "bg-info"
            });
        } else if (
            document.documentElement.scrollTop < 100 ||
            document.body.scrollTop < 100
        ) {
            this.setState({
                color: "navbar-transparent"
            });
        }
    };
    toggleCollapse = () => {
        document.documentElement.classList.toggle("nav-open");
        this.setState({
            collapseOpen: !this.state.collapseOpen
        });
    };
    onCollapseExiting = () => {
        this.setState({
            collapseOut: "collapsing-out"
        });
    };
    onCollapseExited = () => {
        this.setState({
            collapseOut: ""
        });
    };

    render() {
        return (
            <Navbar
                className={"fixed-top " + this.state.color}
                color-on-scroll="100"
                expand="lg"
            >
                <Container>
                    <div className="navbar-translate">
                        <NavbarBrand
                            data-placement="bottom"
                            to="/"
                            rel="noopener noreferrer"
                            title="Designed and Coded by Creative Tim"
                            tag={Link}>
                            <span className="btn-link btn-neutral btn-title">Online Password Storage</span>
                        </NavbarBrand>
                    </div>
                    <Nav navbar>
                        <NavItem className="p-0">
                            <NavLink
                                data-placement="bottom"
                                tag={Link}
                                to="/sign-in"
                                rel="noopener noreferrer"
                                title="Sign In"
                            >
                                <p className="btn-link btn-neutral btn-title">Sign In</p>
                            </NavLink>
                        </NavItem>
                        <NavItem className="p-0">
                            <NavLink
                                data-placement="bottom"
                                tag={Link}
                                to="/sign-up"
                                rel="noopener noreferrer"
                                title="Sign Up">
                                <p className="btn-link btn-neutral btn-title">Sign Up</p>
                            </NavLink>
                        </NavItem>
                    </Nav>
                </Container>
            </Navbar>
        );
    }
}

export default HeaderNavbar;
