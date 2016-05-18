/* eslint react/no-multi-comp:0, no-console:0 */

import createDOMForm from 'rc-form/src/createDOMForm';
import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import Select, { Option } from 'antd/lib/select';
import DatePicker from 'antd/lib/date-picker';
import 'antd/lib/index.css';
import { regionStyle, errorStyle } from './styles';

function Email(props) {
  const { getFieldProps, getFieldError, isFieldValidating } = props.form;
  const errors = getFieldError('email');
  return (<div style={ regionStyle }>
    <p>email sync validate</p>
    <p>
      <input {...getFieldProps('email', {
        rules: [
          {
            type: 'email',
            message: <b key="err">错误的 email 格式</b>,
          },
        ],
      })}
      /></p>
    <p style={errorStyle}>
      {errors}
    </p>
    <p style={errorStyle}>
      {isFieldValidating('email') ? 'validating' : null}
    </p>
  </div>);
}

Email.propTypes = {
  form: PropTypes.object,
};

const User = React.createClass({
  propTypes: {
    form: PropTypes.object,
  },
  userExists(rule, value, callback) {
    setTimeout(() => {
      if (value === '1') {
        callback([new Error('are you kidding?')]);
      } else if (value === 'yiminghe') {
        callback([new Error('forbid yiminghe')]);
      } else {
        callback();
      }
    }, 300);
  },

  render() {
    const { getFieldProps, getFieldError, isFieldValidating } = this.props.form;
    const errors = getFieldError('user');
    return (<div style={ regionStyle }>
      <p><span style={{ color: 'red' }}>*</span> user async validate</p>
      <p>
        <input {...getFieldProps('user', {
          validateFirst: true,
          rules: [
            {
              required: true,
            },
            {
              validator: this.userExists,
            },
          ],
        })}
        /></p>
      <p style={errorStyle}>
        {(errors) ? errors.join(',') : null}
      </p>
      <p style={errorStyle}>
        {isFieldValidating('user') ? 'validating' : null}
      </p>
    </div>);
  },
});


function CustomInput(props) {
  const { getFieldProps, getFieldError, isFieldValidating } = props.form;
  const errors = getFieldError('select');
  return (<div style={ regionStyle }>
    <p><span style={{ color: 'red' }}>*</span> custom select sync validate</p>
    <p><Select
      placeholder="please select"
      style={{ width: 200 }}
      {...getFieldProps('select', {
        rules: [
          {
            required: true,
          },
        ],
      })}
    >
      <Option value="1">1</Option>
      <Option value="2">2</Option>
    </Select></p>
    <p style={errorStyle}>
      {(errors) ? errors.join(',') : null}
    </p>
    <p style={errorStyle}>
      {isFieldValidating('select') ? 'validating' : null}
    </p>
  </div>);
}

CustomInput.propTypes = {
  form: PropTypes.object,
};

function DateInput(props) {
  const { getFieldProps, getFieldError } = props.form;
  const errors = getFieldError('date');
  return (<div style={ regionStyle }>
    <p><span style={{ color: 'red' }}>*</span> DateInput sync validate</p>
    <p style={{ width: 200 }}>
      <DatePicker
        placeholder="please select"
        {...getFieldProps('date', {
          rules: [
            {
              required: true,
              type: 'date',
            },
          ],
        })}
      />
    </p>
    <p style={errorStyle}>
      {(errors) ? errors.join(',') : null}
    </p>
  </div>);
}

DateInput.propTypes = {
  form: PropTypes.object,
};

function toNumber(v) {
  if (v === undefined) {
    return v;
  }
  if (v === '') {
    return undefined;
  }
  if (v && v.trim() === '') {
    return NaN;
  }
  return Number(v);
}

function NumberInput(props) {
  const { getFieldProps, getFieldError } = props.form;
  const errors = getFieldError('number');
  return (<div style={ regionStyle }>
    <p>number input</p>
    <p>
      <input
        {...getFieldProps('number', {
          initialValue: '1',
          rules: [{
            transform: toNumber,
            type: 'number',
          }],
        })}
      />
    </p>
    <p style={errorStyle}>
      {(errors) ? errors.join(',') : null}
    </p>
  </div>);
}

NumberInput.propTypes = {
  form: PropTypes.object,
};

class Form extends Component {
  static propTypes = {
    form: PropTypes.object,
  };

  onSubmit = (e) => {
    console.log('submit');
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((error, values) => {
      if (!error) {
        console.log('ok', values);
      } else {
        console.log('error', error, values);
      }
    });
  };

  reset = (e) => {
    e.preventDefault();
    this.props.form.resetFields();
  };

  render() {
    const { form } = this.props;
    const { getFieldProps, getFieldError } = form;
    return (<div style={{ margin: 20 }}>
      <h2>overview</h2>
      <form onSubmit={this.onSubmit}>
        <User form={ form } saveRef={this.saveRef}/>

        <NumberInput form={ form }/>

        <Email form={ form }/>

        <CustomInput form={ form }/>

        <DateInput form={ form }/>

        <div style={ regionStyle }>
          <p>normal required input</p>
          <p>
            <input
              {...getFieldProps('normal', {
                rules: [{
                  required: true,
                }],
              })}
            />
          </p>
          <p style={errorStyle}>
            {(getFieldError('normal')) ? getFieldError('normal').join(',') : null}
          </p>
        </div>

        <div style={ regionStyle }>
          <button onClick={this.reset}>reset</button>
          &nbsp;
          <input type="submit" value="submit"/>
        </div>
      </form>
    </div>);
  }
}

const NewForm = createDOMForm({
  validateMessages: {
    required(field) {
      return `${field} 必填`;
    },
  },
})(Form);

ReactDOM.render(<NewForm />, document.getElementById('__react-content'));
