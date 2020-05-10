import React, { Component } from "react";
import jwt_decode from "jwt-decode";
import { getHistory, clearHist } from "./UserFunctions";

class Hist extends Component {
  constructor() {
    super();
    const token = localStorage.usertoken;
    const decoded = jwt_decode(token);
    const data = {
      email: decoded.identity.email,
    };
    this.state = {
      tableData: "",
    };
    getHistory(data).then((resp) => {
      for (const itm of resp) {
        delete itm["id"];
        delete itm["email"];
      }
      console.log(resp);
      this.setState({ tableData: resp });
    });
    // console.log(this.data)
    
    this.getRowsData = this.getRowsData.bind(this);
    this.getKeys = this.getKeys.bind(this);
    this.handleClear = this.handleClear.bind(this);
  }
  
  handleClear = function () {
    const token = localStorage.usertoken;
    const decoded = jwt_decode(token);
    
    const data = {
      email: decoded.identity.email,
    };
    
    clearHist(data).then((resp) => {
      this.setState({ tableData: "" });
    });
  }

  getKeys = function () {
    return Object.keys(this.state.tableData[0]);
  };

  getRowsData = function () {
    if (this.state.tableData == "") {
      return <tr></tr>;
    }

    var items = this.state.tableData;
    var keys = this.getKeys();

    const idx = [2, 3, 4, 1, 0, 5];
    const keysOrdered = idx.map(i => keys[i]);
    return items.map((row, index) => {
      return (
        <tr key={index}>
          <RenderRow key={index} data={row} keys={keysOrdered} />
        </tr>
      );
    });
  };

  componentDidMount() {}

  render() {
    return (
      <div className="container">
        <div className="jumbotron mt-5">
          <div className="col-sm-8 mx-auto">
            <h1 className="text-center">History</h1>
          </div>
          <table className="table col-md-6 mx-auto">
            <thead>
              <tr>
                <th>Total living area(m²)</th>
                <th>Lot area(m²)</th>
                <th>Lot street frontage(m)</th>
                <th>Bedrooms</th>
                <th>Bathrooms</th>
                <th>Price($)</th>
              </tr>
            </thead>
            <tbody>{this.getRowsData()}</tbody>
          </table>
        </div>
        <button onClick={this.handleClear} className="btn btn-lg btn-primary">
          Clear history
        </button>
      </div>
    );
  }
}

const RenderRow = (props) => {
  return props.keys.map((key, index) => {
    return <td key={props.data[key]}>{props.data[key]}</td>;
  });
};

export default Hist;
