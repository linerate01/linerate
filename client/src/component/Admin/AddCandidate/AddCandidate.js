import React, { Component } from "react";

import Navbar from "../../Navbar/Navigation";
import NavbarAdmin from "../../Navbar/NavigationAdmin";

import getWeb3 from "../../../getWeb3";
import Election from "../../../contracts/Election.json";

import AdminOnly from "../../AdminOnly";

import "./AddCandidate.css";

export default class AddCandidate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ElectionInstance: undefined,
      web3: null,
      accounts: null,
      isAdmin: false,
      header: "",
      slogan: "",
      candidates: [],
      candidateCount: undefined,
    };
  }

  componentDidMount = async () => {
    // refreshing page only once
    if (!window.location.hash) {
      window.location = window.location + "#loaded";
      window.location.reload();
    }

    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = Election.networks[networkId];
      const instance = new web3.eth.Contract(
        Election.abi,
        deployedNetwork && deployedNetwork.address
      );
      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({
        web3: web3,
        ElectionInstance: instance,
        account: accounts[0],
      });

      // Total number of candidates
      const candidateCount = await this.state.ElectionInstance.methods
        .getTotalCandidate()
        .call();
      this.setState({ candidateCount: candidateCount });

      const admin = await this.state.ElectionInstance.methods.getAdmin().call();
      if (this.state.account === admin) {
        this.setState({ isAdmin: true }); 
      }

      // Loading Candidates details
      for (let i = 0; i < this.state.candidateCount; i++) {
        const candidate = await this.state.ElectionInstance.methods
          .candidateDetails(i)
          .call();
        this.state.candidates.push({
          id: candidate.candidateId,
          header: candidate.header,
          slogan: candidate.slogan,
        });
      }

      this.setState({ candidates: this.state.candidates });
    } catch (error) {
      // Catch any errors for any of the above operations.
      console.error(error);
      alert(
        `????????????ID??? Contract??? ?????????????????? ?????????????????????. ????????? ??????????????????.`
      );
    }
  };
  updateHeader = (event) => {
    this.setState({ header: event.target.value });
  };
  updateSlogan = (event) => {
    this.setState({ slogan: event.target.value });
  };

  addCandidate = async () => {
    await this.state.ElectionInstance.methods
      .addCandidate(escape(this.state.header), escape(this.state.slogan))
      .send({ from: this.state.account, gas: 1000000 });
    window.location.reload();
  };

  render() {
    if (!this.state.web3) {
      return (
        <>
          {this.state.isAdmin ? <NavbarAdmin /> : <Navbar />}
          <center>????????????ID??? Contract??? ???????????? ??? ?????????.</center>
        </>
      );
    }
    if (!this.state.isAdmin) {
      return (
        <>
          <Navbar />
          <AdminOnly page="????????? ??????" />
        </>
      );
    }
    return (
      <>
        <NavbarAdmin />
        <script type="text/javascript" src="AddCandidate.js"></script>
        <div className="container-main">
          <h2>????????? ????????????</h2>
          <small>??? ????????? ???: {this.state.candidateCount}</small>
          <div className="container-item">
            <form className="form">
              <label className={"label-ac"}>
                ????????? ??????
                <input
                  className={"input-ac"}
                  type="text"
                  placeholder="???: ?????????"
                  value={this.state.header}
                  onChange={this.updateHeader}
                />
              </label>
              <label className={"label-ac"}>
                ??????
                <input
                  className={"input-ac"}
                  type="text"
                  placeholder="???: ????????? ?????????."
                  value={this.state.slogan}
                  onChange={this.updateSlogan}
                />
              </label>

              <button
                className="btn-add"
                disabled={
                  this.state.header.length < 3 || this.state.header.length > 21
                }
                onClick={this.addCandidate}
              >
                ??????
              </button>

            </form>
          </div>
        </div>
        {loadAdded(this.state.candidates)}
      </>
    );
  }
}
export function loadAdded(candidates) {
  const renderAdded = (candidate) => {
    return (
      <>
        <div className="container-list" >
          <div
            style={{
              maxHeight: "21px",
              overflow: "auto",
            }}
          >
            [??????{candidate.id}???{"] "} <strong> {unescape(candidate.header)} </strong>:{" "}
            {unescape(candidate.slogan)}
          </div>
        </div>
      </>
    );
  };
  return (
    <div className="container-main" style={{ borderTop: "1px solid" }}>
      <div className="container-item">
        <center>????????? ??????</center>
      </div>
      {candidates.length < 1 ? (
        <div className="container-item alert">
          <center>????????? ??????????????? ???????????? ????????????.</center>
        </div>
      ) : (
        <div
          className="container-item"
          style={{
            display: "block",
          }}
        > 
          {candidates.map(renderAdded)}
        </div>
      )}
    </div>
  );
}
