import React, { Component } from "react";
import jwt_decode from "jwt-decode";
import { predict } from "./UserFunctions";

class Predict extends Component {
  constructor() {
    super();
    this.state = {
      email: '',
      total_living_area : '',
      lot_area : '',
      lot_frontage : '',
      bedrooms : '',
      baths : '',
      price: '-',
      errors: {},
    };
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  onSubmit(e) {
    e.preventDefault();
    const token = localStorage.usertoken
    const decoded = jwt_decode(token)
    console.log(decoded.identity.email)
    
    const data = {
      email: decoded.identity.email,
      totalGroundArea: this.state.total_living_area,
      lotArea : this.state.lot_area,
      lotFrontage : this.state.lot_frontage,
      bedroomNumber : this.state.bedrooms,
      bathroomNumber : this.state.baths
    };

    predict(data).then((res) => {
      console.log(res["prediction"])
      this.setState({price : res["prediction"]})
      this.props.history.push(`/predict`);
    });
  }

  render() {
    return (
      <div className="container">
        <div className="row">
          <div className="col-md-6 mt-5 mx-auto">
            <form onSubmit={this.onSubmit}>
              <h1 className="h3 mb-3 font-weight-normal">Predict price</h1>
              <div className="form-group">
                <label htmlFor="total_living_area">Total living area(m²)</label>
                <input
                  type="number"
                  className="form-control"
                  name="total_living_area"
                  placeholder="Enter total surface of the house"
                  value={this.state.total_living_area}
                  onChange={this.onChange}
                  required="required"
                />
              </div>
              <div className="form-group">
                <label htmlFor="lot_area">Lot area(m²)</label>
                <input
                  type="number"
                  className="form-control"
                  name="lot_area"
                  placeholder="Enter lot area"
                  value={this.state.lot_area}
                  onChange={this.onChange}
                  required="required"
                />
              </div>
              <div className="form-group">
                <label htmlFor="lot_frontage">Lot street frontage(m)</label>
                <input
                  type="number"
                  className="form-control"
                  name="lot_frontage"
                  placeholder="Enter lot street frontage"
                  value={this.state.lot_frontage}
                  onChange={this.onChange}
                  required="required"
                />
              </div>
              <div className="form-group">
                <label htmlFor="bedrooms">Number of bedrooms</label>
                <input
                  type="bedrooms"
                  className="form-control"
                  name="bedrooms"
                  placeholder="Number of bedrooms"
                  value={this.state.bedrooms}
                  onChange={this.onChange}
                  required="required"
                />
              </div>
              <div className="form-group">
                <label htmlFor="baths">Number of bathrooms</label>
                <input
                  type="baths"
                  className="form-control"
                  name="baths"
                  placeholder="Number of bathrooms"
                  value={this.state.baths}
                  onChange={this.onChange}
                  required="required"
                />
              </div>
              <button
                type="submit"
                className="btn btn-lg btn-primary btn-block"
              >
                Predict
              </button>
              <br />
              <br />
              <br />
              <div className="form-group">
                <label htmlFor="pred">Predicted price($)</label>
                <div class="alert alert-primary" role="alert"> {this.state.price} </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default Predict;
