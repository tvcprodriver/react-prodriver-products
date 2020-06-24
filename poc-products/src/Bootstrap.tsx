import React, { Component } from "react";
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Input,
  Nav,
  NavItem,
  NavLink,
  Container,
  Row,
  Col,
  Jumbotron,
  Button,
  FormGroup,
  Label,
} from "reactstrap";
import "bootstrap/dist/css/bootstrap.min.css";

interface IComponentState {
  isOpen: boolean;
  dropDownOpen: boolean;
}

class App extends Component<{}, IComponentState> {
  constructor(props) {
    super(props);
    this.toggle = this.toggle.bind(this);
    this.dropDownToggle = this.dropDownToggle.bind(this);
    this.state = { isOpen: false, dropDownOpen: false };
  }
  toggle() {
    this.setState({ isOpen: !this.state.isOpen });
  }

  dropDownToggle() {
    this.setState({ dropDownOpen: !this.state.dropDownOpen });
  }

  render() {
    return (
      <div>
        <Navbar color='inverse' light expand='md'>
          <NavbarBrand href='/'>reactstrap</NavbarBrand>
          <NavbarToggler onClick={this.toggle} />
          <Collapse isOpen={this.state.isOpen} navbar>
            <Nav className='ml-auto' navbar>
              <NavItem>
                <NavLink href='http://reactstrap.github.io/components'>
                  Components
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink href='https://github.com/reactstrap/reactstrap'>
                  Github
                </NavLink>
              </NavItem>
            </Nav>
          </Collapse>
        </Navbar>
        <Jumbotron>
          <Container>
            <Row>
              <Col>
                <h1>Reactstrap</h1>
                <p>
                  <Button
                    tag='a'
                    color='success'
                    size='large'
                    href='http://reactstrap.github.io/components/alerts/'
                    target='_blank'
                  >
                    View Reactstrap Component Documentation
                  </Button>
                </p>
              </Col>
            </Row>
            <Row>
              <Col>
                <h3>Checkbox</h3>
                <FormGroup check>
                  <Label check>
                    <Input type='checkbox' />
                    Check me out
                  </Label>
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col>
                <h3>Buttons</h3>
                <Button color='primary'>primary</Button>
                <Button color='secondary'>secondary</Button>
                <Button color='success'>success</Button>
                <Button color='info'>info</Button>
                <Button color='warning'>warning</Button>
                <Button color='danger'>danger</Button>
                <Button color='link'>link</Button>
              </Col>
            </Row>
          </Container>
        </Jumbotron>
      </div>
    );
  }
}
export default App;
