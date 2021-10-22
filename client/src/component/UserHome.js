import React from "react";

function UserHome(props) {
  return (
    <div>
      <div className="container-main">
        <div className="container-list title">
          <h1>{unescape(props.el.electionTitle)}</h1>
          <br />
          <center>{unescape(props.el.organizationTitle)}</center>
          <table style={{ marginTop: "21px" }}>
            <tr>
              <th>admin</th>
              <td>
                {unescape(props.el.adminName)} ({unescape(props.el.adminTitle)})
              </td>
            </tr>
            <tr>
              <th>contact</th>
              <td style={{ textTransform: "none" }}>{props.el.adminEmail}</td>
            </tr>
          </table>
        </div>
      </div>
    </div>
  );
}

export default UserHome;
