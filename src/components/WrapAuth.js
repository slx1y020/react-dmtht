import React, { Component } from "react";
import store from "../reducers/store";

let wrapAuth = (ComposedComponent) =>
  class WrapComponent extends Component {
    state = {
      isShow: false,
    };

    componentWillMount = () => {
      this.setState({
        isShow: !!store
          .getState()
          .MenuLists.menus.find((p) => p.own_url === this.props.auth),
      });
    };
    render() {
      return this.state.isShow ? <ComposedComponent {...this.props} /> : null;
    }
  };
export default wrapAuth;
