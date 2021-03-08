/*
 * @Date: 2021-03-08 13:08:18
 * @LastEditors: Aiva
 * @LastEditTime: 2021-03-08 13:08:31
 * @FilePath: \AivaBlog_Admin\src\views\Manage\asyncImport.js
 */
import React, { Component } from "react";

export default function asyncComponent(importComponent) {
  class AsyncComponent extends Component {
    constructor(props) {
      super(props);

      this.state = {
        component: null
      };
    }

    async componentDidMount() {
      const { default: component } = await importComponent();

      this.setState({
        component: component
      });
    }

    render() {
      const C = this.state.component;

      return C ? <C {...this.props} /> : null;
    }
  }

  return AsyncComponent;
}