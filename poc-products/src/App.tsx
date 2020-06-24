import React, { Component } from "react";
import {
  Input,
  Container,
  Row,
  Col,
  Button,
  Label,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Toast,
  ToastHeader,
  ToastBody,
  ListGroup,
  ListGroupItem,
  Collapse,
  Card,
} from "reactstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  ProductService,
  Offering,
  OptionalOffering,
  Product,
} from "prodriver-products";
import { IOrder, IProductModel } from "prodriver-products/build/models";
import { IComponentState, ICheckoutResponse, IError } from "./models";
import { config } from "./configs/pro-driver";

const defaultCheckoutResponse: ICheckoutResponse = {
  productId: 0,
  productName: "",
  enrolledOfferings: [],
  showResponse: false,
  promotion: null,
};

class App extends Component<{}, IComponentState> {
  noError: IError = { show: false, title: "", message: "" };

  private readonly applicationId: string = config.applicationId;

  constructor(props) {
    super(props);
    this.toggle = this.toggle.bind(this);
    this.dropDownToggle = this.dropDownToggle.bind(this);
    this.selectProduct = this.selectProduct.bind(this);
    this.hideError = this.hideError.bind(this);
    this.hideCheckoutResponse = this.hideCheckoutResponse.bind(this);
    this.checkout = this.checkout.bind(this);
    this.setOverlay = this.setOverlay.bind(this);
    this.showError = this.showError.bind(this);
    this.toggleChild = this.toggleChild.bind(this);
    this.updateProductId = this.updateProductId.bind(this);
    this.loadProduct = this.loadProduct.bind(this);
    this.updatePromotion = this.updatePromotion.bind(this);
    this.loadPromotion = this.loadPromotion.bind(this);
    this.state = {
      isOpen: false,
      dropDownOpen: false,
      products: [],
      product: null,
      error: this.noError,
      checkoutResponse: defaultCheckoutResponse,
      showOverlay: false,
      childOfferingVisible: new Map<string, boolean>(),
      productId: 0,
      promotionId: 0,
    };
  }
  toggle() {
    this.setState({ isOpen: !this.state.isOpen });
  }

  dropDownToggle() {
    this.setState({ dropDownOpen: !this.state.dropDownOpen });
  }

  componentDidMount() {
    ProductService.Url = config.productApi;
    ProductService.Products(this.applicationId, null, true)
      .then((products: IProductModel[]) => {
        this.setState({
          products: (products || []).map(
            (p) =>
              new Product(
                this.applicationId,
                p,
                this.showError,
                this.setOverlay
              )
          ),
        });
      })
      .catch((e) => {
        this.showError("Error retrieving products", `${e}`);
      });
  }

  setOverlay(value: boolean) {
    if(!value) {
      this.forceUpdate() // force React to re-render even though we haven't altered state
    }
    // this.setState({ showOverlay: value });
  }

  selectProduct(product: Product, e: any) {
    this.setState({ product: product, promotionId: product.promotion.id });
  }

  handleOfferingSelection(offering: OptionalOffering, e: any) {
    offering.toggle();
  }

  showError(title: string, message: string) {
    this.setState({ error: { show: true, title, message } });
  }

  hideError() {
    this.setState({ error: this.noError });
  }

  hideCheckoutResponse() {
    this.setState({
      checkoutResponse: { ...this.state.checkoutResponse, showResponse: false },
    });
  }

  checkout() {
    this.state.product.getOrder().then((response: IOrder) => {
      this.setState({
        checkoutResponse: { ...response, showResponse: true },
      });
      console.log(response);
    });
  }

  toggleChild(id, e) {
    let map = this.state.childOfferingVisible;
    map[id] = !map[id];
    this.setState({ childOfferingVisible: map });
  }

  updateProductId(e) {
    this.setState({ productId: parseInt(e.target.value) });
  }

  loadProduct(e) {
    Product.CreateFromMatrixProduct(this.applicationId, this.state.productId)
      .then((p: Product) => {
        this.setState({ product: p, promotionId: p.promotion.id });
      })
      .catch((e) => {
        this.showError("Error loading Matrix product", `${e}`);
      });
  }

  updatePromotion(e) {
    this.setState({ promotionId: parseInt(e.target.value) });
  }

  loadPromotion(e) {
    let product = this.state.product;
    this.state.product.updatePromotion(this.state.promotionId);
    this.setState({ product: product });
  }

  render() {
    return (
      <div>
        <div className='jumbotron' style={{ position: "relative" }}>
          <Toast
            isOpen={this.state.checkoutResponse.showResponse}
            fade={true}
            style={{
              position: "absolute",
              top: "50%",
              right: "50%",
              transform: "translate(-50%, -50%)",
              zIndex: 1,
            }}
          >
            <ToastHeader toggle={this.hideCheckoutResponse}>
              {this.state.checkoutResponse
                ? this.state.checkoutResponse.productName
                : ""}{" "}
              &nbsp;
            </ToastHeader>
            <ToastBody>
              {this.state.checkoutResponse && (
                <ListGroup flush>
                  <ListGroupItem>
                    <b>Matrix Product ID:</b>{" "}
                    {this.state.checkoutResponse.productId}
                  </ListGroupItem>
                  <ListGroupItem>
                    <b>Price:</b> $
                    {this.state.checkoutResponse.promotion?.price.toFixed(2)}
                  </ListGroupItem>
                  {this.state.checkoutResponse.enrolledOfferings.map(
                    (offering: string) => (
                      <ListGroupItem key={offering}>{offering}</ListGroupItem>
                    )
                  )}
                </ListGroup>
              )}
            </ToastBody>
          </Toast>
          <Container>
            <Row>
              <Col className="d-inline-flex align-items-center justify-content-end">
                <b>Lookup a specific Matrix product ID:</b>
              </Col>
              <Col>
                <Input type="text" onChange={this.updateProductId} />
              </Col>
              <Col>
                <Button onClick={this.loadProduct}>
                  Load Matrix Product
                </Button>
              </Col>
            </Row>
            <Row className="mt-3">
              <Col>
                      <hr />
              </Col>
            </Row>
            <Row className="mt-3">
              <Dropdown
                isOpen={this.state.dropDownOpen}
                toggle={this.dropDownToggle}
              >
                <DropdownToggle caret id='size-dropdown' color='primary'>
                  {this.state.product
                    ? this.state.product.name
                    : "Select a plan"}
                </DropdownToggle>
                <DropdownMenu>
                  {this.state.products.map((product: Product) => (
                    <DropdownItem
                      key={product.id}
                      onClick={(e) => {
                        this.selectProduct(product, e);
                      }}
                    >
                      {product.name}
                    </DropdownItem>
                  ))}
                </DropdownMenu>
              </Dropdown>
              <Toast isOpen={this.state.error.show} fade={true}>
                <ToastHeader toggle={this.hideError}>
                  {this.state.error.title}
                </ToastHeader>
                <ToastBody>{this.state.error.message}</ToastBody>
              </Toast>
              &nbsp;&nbsp;
              <Button
                color='success'
                onClick={this.checkout}
                disabled={this.state.product == null}
              >
                Get Matrix product ID for selected plan
              </Button>
            </Row>
            <Row>
              {this.state.product ? (
                <Container className="mt-4">
                  <Row>
                    <Col className="d-inline-flex align-items-center justify-content-end">
                      <b>Promotion ID:</b>
                    </Col>
                    <Col>
                      <Input type='text' onChange={this.updatePromotion} />
                    </Col>
                    <Col>
                      <Button onClick={this.loadPromotion}>
                        Update Promotion
                      </Button>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <div className="mt-2">
                        <b>Promotion ID:</b> {this.state.product.promotion.id}
                      </div>
                      <div className="mt-2">
                        <b>Price:</b>&nbsp;$
                        {this.state.product.promotion.price.toFixed(2)}{" "}
                        {this.state.product.promotion.text}
                      </div>

                      {this.state.product.promotion.recurringPaymentStartDate && (
                        <div>
                          <div className="mt-2">
                            <b>Starting:</b>&nbsp;
                            {this.state.product.promotion.recurringPaymentStartDate}
                          </div>
                          <div className="mt-2">
                            <b>Price:</b>&nbsp;$
                            {this.state.product.promotion.recurringPaymentAmount.toFixed(
                              2
                            )}{" "}
                            {this.state.product.promotion.recurringPaymentCycle}
                          </div>
                        </div>
                      )}
                      
                    </Col>
                  </Row>

                  <Row>
                    <Col className="mt-2">
                      <b>Benefits:</b>
                    </Col>
                  </Row>
                  <Row>
                    <Col xs='1'></Col>
                    <Col>
                      {this.state.product.benefits
                        .getOfferingsByLevel(null)
                        .map((benefit: Offering) => (
                          <div key={benefit.id}>
                            {benefit.hasChildren() ? (
                              <div
                                style={{
                                  fontWeight: "bold",
                                  cursor: "pointer",
                                }}
                                onClick={(e) => {
                                  this.toggleChild(benefit.id, e);
                                }}
                              >
                                {benefit.name}
                              </div>
                            ) : (
                              <span>{benefit.name}</span>
                            )}{" "}
                            <Collapse
                              isOpen={
                                this.state.childOfferingVisible[benefit.id]
                              }
                            >
                              {this.state.product.benefits
                                .getOfferingsByLevel(benefit.offerId)
                                .map((childBenefit: Offering) => (
                                  <div style={{ marginLeft: "18px" }} key={childBenefit.id}>
                                    {childBenefit.name}
                                  </div>
                                ))}
                            </Collapse>
                          </div>
                        ))}
                      {this.state.product.benefits.length === 0 && (
                        <div>None</div>
                      )}
                    </Col>
                  </Row>
                  <Row>
                    <Col>&nbsp;</Col>
                  </Row>
                  <Row>
                    <Col style={{ marginBottom: "10px" }}>
                      <b>Enrollment Options:</b>
                    </Col>
                  </Row>
                  <Row>
                    <Col xs='1'></Col>

                    <Col style={{ marginLeft: "20px" }}>
                      {this.state.product.enrollmentOptions.map(
                        (offering: OptionalOffering) => (
                          <div key={offering.id}>
                            <Label check>
                              <Input
                                type='checkbox'
                                defaultChecked={offering.isSelected}
                                value={offering.id}
                                onChange={(e) => {
                                  this.handleOfferingSelection(offering, e);
                                }}
                              />
                              {offering.name}
                            </Label>
                          </div>
                        )
                      )}
                      {this.state.product.enrollmentOptions.length === 0 && (
                        <div>None</div>
                      )}
                    </Col>
                  </Row>
                  <Row>
                    <Col>&nbsp;</Col>
                  </Row>
                  <Row>
                    <Col style={{ marginBottom: "10px" }}>
                      <b>Add-On Options:</b>
                    </Col>
                  </Row>
                  <Row>
                    <Col xs='1'></Col>

                    <Col>
                      {this.state.product.addOnOptions.map(
                        (offering: OptionalOffering) => (
                          <div style={{ marginLeft: "20px" }} key={offering.id}>
                            <Label check>
                              <Input
                                type='checkbox'
                                defaultChecked={offering.isSelected}
                                value={offering.id}
                                onChange={(e) => {
                                  this.handleOfferingSelection(offering, e);
                                }}
                              />
                              {offering.name}
                            </Label>
                          </div>
                        )
                      )}
                      {this.state.product.addOnOptions.length === 0 && (
                        <div>None</div>
                      )}
                    </Col>
                  </Row>
                </Container>
              ) : (
                <div></div>
              )}
            </Row>
          </Container>
        </div>
        {this.state.showOverlay && (
          <div
            style={{
              minHeight: "100vh",
              minWidth: "100vw",
              backgroundColor: "black",
              opacity: "0.2",
              position: "absolute",
              top: 0,
              left: 0,
            }}
          ></div>
        )}
      </div>
    );
  }
}
export default App;
