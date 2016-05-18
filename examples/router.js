/* eslint react/no-multi-comp:0, no-console:0 */

import React, { PropTypes } from 'react';
import { createForm } from 'rc-form';
import { render } from 'react-dom';
import { Router } from 'react-router';
import { createRootContainer, createContainer } from 'react-data-binding';
import { createHashHistory } from 'history';

const history = createHashHistory();

const style = `
.region p {
  border: 1px solid red;
  padding: 5px;
  margin: 10px;
}
.error {
  color: red;
}
`;

let App = React.createClass({
  propTypes: {
    location: PropTypes.object,
    children: PropTypes.object,
  },
  onClick(e) {
    e.preventDefault();
    history.goBack();
  },
  render() {
    const { location } = this.props;
    return (<div>
      <style dangerouslySetInnerHTML={{ __html: style }}/>
      <p>header {location.pathname === '/' ? null : <a href="#" onClick={this.onClick}>back</a>}</p>
      <div>
        {this.props.children}
      </div>
    </div>);
  },
});

App = createRootContainer()(App);

function onClick(name) {
  this.props.setStoreState({
    formState: {
      ...this.props.getStoreState().formState,
      city: {
        value: name,
      },
    },
  });
  history.pushState('/');
}

let CitySelector = React.createClass({
  propTypes: {
    setStoreState: PropTypes.func,
    getStoreState: PropTypes.func,
  },
  getDefaultProps() {
    return {
      onChange() {
      },
    };
  },
  render() {
    return (<div className="region">
      <p onClick={onClick.bind(this, 'sh')}>
        shanghai
      </p>
      <p onClick={onClick.bind(this, 'hz')}>
        hangzhou
      </p>
    </div>);
  },
});

CitySelector = createContainer()(CitySelector);

const CityInput = React.createClass({
  propTypes: {
    value: PropTypes.any,
  },
  onClick(e) {
    e.preventDefault();
    history.pushState({}, '/city-selector');
  },
  render() {
    return (<a href="#" onClick={this.onClick}>{this.props.value || 'please select'}</a>);
  },
});

let Form = React.createClass({
  propTypes: {
    form: PropTypes.object,
  },
  onSubmit(e) {
    e.preventDefault();
    this.props.form.validateFields((error, values) => {
      console.log(error || 'ok', values);
    });
    // console.log(this.props.form.getFieldsValue());
  },
  render() {
    const { getFieldProps, getFieldError } = this.props.form;
    return (<div className="region">
      <div>
        <p>user:
          <input {...getFieldProps('user', {
            rules: [{
              required: true,
            }],
          })}
          /></p>
        {getFieldError('user') ? <p className="error">{getFieldError('user').join(',')}</p> : null}
      </div>
      <div>
        <p>city:
          <CityInput {...getFieldProps('city', {
            rules: [{
              required: true,
            }],
            validatorTrigger: false,
            trigger: false,
          })}
          /></p>
        {getFieldError('city') ? <p className="error">{getFieldError('city').join(',')}</p> : null}
      </div>
      <p>
        <button onClick={this.onSubmit}>submit</button>
      </p>
    </div>);
  },
});

Form = createForm({
  mapPropsToFields(props) {
    return props.formState;
  },
  onFieldsChange(props, fields) {
    props.setStoreState({
      formState: {
        ...props.formState,
        ...fields,
      },
    });
  },
})(Form);

Form = createContainer((state) => {
  return {
    formState: state.formState,
  };
})(Form);

const routes = {
  path: '/',
  component: App,
  indexRoute: {
    component: Form,
  },
  childRoutes: [{
    path: 'city-selector',
    component: CitySelector,
  }],
};

render(
  <div style={{ margin: 20 }}>
    <h1>integrate with react-router</h1>
    <Router history={history}>{routes}</Router>
  </div>, document.getElementById('__react-content'));
