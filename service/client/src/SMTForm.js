import React, { Component } from "react";
import {
  Steps,
  Table,
  Badge,
  Tag,
  message,
  Form,
  Select,
  InputNumber,
  DatePicker,
  Switch,
  Slider,
  Button,
  Row,
  Col
} from "antd";
import ReactJson from "react-json-view";
import moment from "moment";
import { solveDummy } from "./solvers/WeightedProductModelSolver";

const { Option } = Select;

class SMTForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      //add if needed
      matchingDevices: [],
      devices: this.props.devices,
      currentStep: 0,
      selectedVariantRowKeys: [],
      selectedDeviceRowKeys: [],

      //formValues: {
      environment_value: [],
      environment_weight: 5,
      environment_toggle: false,

      status_value: [],
      status_weight: 5,
      status_toggle: false,

      capability_value: [],
      capability_weight: 5,
      capability_toggle: false,

      network_value: [],
      network_weight: 5,
      network_toggle: false,
      cpu_value: 10,
      cpu_weight: 5,
      cpu_toggle: false,

      ram_value: 10,
      ram_weight: 5,
      ram_toggle: false,

      storage_value: 10,
      storage_weight: 5,
      storage_toggle: false,

      number_value: 10,
      number_weight: 5,
      number_toggle: false,

      range_value: 10,
      range_weight: 5,
      range_toggle: false,

      myValidateHelp: "",
      myValidateStatus: ""
    };
  }

  handleSubmit = e => {
    e.preventDefault();
    //TODO deploy selected variant to selected devices
  };

  removeDisabledFields = values => {
    //TODO
    if (this.state.environment_toggle) delete values.environment;
    if (this.state.status_toggle) delete values.status;
    if (this.state.capability_toggle) delete values.capability;
    if (this.state.network_toggle) delete values.network;
    if (this.state.lastactive_toggle) delete values.lastactive;
    if (this.state.lastupdate_toggle) delete values.lastupdate;
    if (this.state.cpu_toggle) delete values.cpu;
    if (this.state.ram_toggle) delete values.ram;
    if (this.state.storage_toggle) delete values.storage;
    if (this.state.number_toggle) delete values.number;
    if (this.state.range_toggle) delete values.range;
    return values;
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    //const { myValidateHelp, myValidateStatus } = this.state;
    const { currentStep } = this.state;
    const formItemLayout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 16 }
    };
    // const rangeConfig = {
    //   rules: [{ type: "array", message: "Please select time!" }]
    // };
    const { selectedVariantRowKeys } = this.state;
    const variantRowSelection = {
      selectedRowKeys: selectedVariantRowKeys,
      onChange: this.onVariantSelectChange,
      type: "radio"
    };
    const { selectedDeviceRowKeys } = this.state;
    const deviceRowSelection = {
      selectedRowKeys: selectedDeviceRowKeys,
      onChange: this.onDeviceSelectChange
      //type: "radio"
    };
    const validateMessages = {
      required: "'${name}' is a required field!"
    };

    return (
      <Form
        {...formItemLayout}
        validateMessages={validateMessages}
        // onSubmit={this.handleSubmit}
        // onChange = { e =>
        //     console.log("changed", e.target.value)
        // }
        //style={{ backgroundColor: "#fff" }}
      >
        <Form.Item
          label={
            <span>
              <Switch
                //defaultChecked
                checked={!this.state.environment_toggle}
                size="small"
                onClick={() => {
                  this.setState({
                    environment_toggle: !this.state.environment_toggle
                  });
                }}
              />{" "}
              Version
            </span>
          }
        >
          <Row>
            <Col>
              {getFieldDecorator("vsn", {
                hidden: this.state.vsn_toggle,
                initialValue: this.state.vsn,
                rules: [
                  {
                    required: true,
                    type: "array"
                  }
                ]
              })(
                <Select
                  mode="multiple"
                  placeholder="Please select version"
                  disabled={this.state.vsn_toggle}
                  onChange={e => this.setState({ vsn_value: e })}
                >
                  <Option value="release">Release</Option>
                  <Option value="development">Development</Option>
                  <Option value="preview">Preview</Option>
                </Select>
              )}
            </Col>
          </Row>
        </Form.Item>
        <Form.Item
          label={
            <span>
              <Switch
                checked={!this.state.compu_level_toggle}
                size="small"
                onClick={() => {
                  this.setState({
                    compu_level_toggle: !this.state.compu_level_toggle
                  });
                }}
              />{" "}
              Computation level
            </span>
          }
        >
          <Row>
            <Col>
              {getFieldDecorator("compu_level", {
                hidden: this.state.compu_level_toggle,
                initialValue: this.state.compu_level,
                rules: [
                  {
                    required: true,
                    type: "array"
                  }
                ]
              })(
                <Select
                  mode="single"
                  placeholder="Please select computation level"
                  disabled={this.state.compu_level_toggle}
                  onChange={value => this.setState({ compu_level: value })}
                >
                  <Option value="1">1</Option>
                  <Option value="2">2</Option>
                  <Option value="3">3</Option>
                </Select>
              )}
            </Col>
          </Row>
        </Form.Item>
        <Form.Item
          label={
            <span>
              <Switch
                checked={!this.state.compu_level_toggle}
                size="small"
                onClick={() => {
                  this.setState({
                    comm_level_toggle: !this.state.comm_level_toggle
                  });
                }}
              />{" "}
              Communication level
            </span>
          }
        >
          <Row>
            <Col>
              {getFieldDecorator("comm_level", {
                hidden: this.state.comm_level_toggle,
                initialValue: this.state.comm_level,
                rules: [
                  {
                    required: true,
                    type: "array"
                  }
                ]
              })(
                <Select
                  mode="single"
                  placeholder="Please select communication level"
                  disabled={this.state.comm_level_toggle}
                  onChange={value => this.setState({ comm_level: value })}
                >
                  <Option value="1">1</Option>
                  <Option value="2">2</Option>
                  <Option value="3">3</Option>
                </Select>
              )}
            </Col>
          </Row>
        </Form.Item>
        <Form.Item
          label={
            <span>
              <Switch
                checked={!this.state.dp_acc_toggle}
                size="small"
                onClick={() => {
                  this.setState({
                    dp_acc_toggle: !this.state.dp_acc_toggle
                  });
                }}
              />{" "}
              Hardware acceleration
            </span>
          }
        >
          <Row>
            <Col>
              {getFieldDecorator("dp_acc", {
                hidden: this.state.dp_acc_toggle,
                initialValue: this.state.dp_acc,
                rules: [
                  {
                    required: true,
                    type: "array"
                  }
                ]
              })(
                <Select
                  mode="multiple"
                  placeholder="Please select hardware acceleration"
                  disabled={this.state.dp_acc_toggle}
                  onChange={value => this.setState({ dp_acc: value })}
                >
                  <Option value="acc_none">None</Option>
                  <Option value="tpu">TPU</Option>
                </Select>
              )}
            </Col>
          </Row>
        </Form.Item>
        <Form.Item
          label={
            <span>
              <Switch
                checked={!this.state.intlmodule_toggle}
                size="small"
                onClick={() => {
                  this.setState({
                    intlmodule_toggle: !this.state.intlmodule_toggle
                  });
                }}
              />{" "}
              Intelligence module
            </span>
          }
        >
          <Row>
            <Col>
              {getFieldDecorator("intlmodule", {
                hidden: this.state.intlmodule_toggle,
                initialValue: this.state.intlmodule,
                rules: [
                  {
                    required: true,
                    type: "array"
                  }
                ]
              })(
                <Select
                  mode="multiple"
                  placeholder="Please select intelligence module"
                  disabled={this.state.intlmodule_toggle}
                  onChange={value => this.setState({ intlmodule: value })}
                >
                  <Option value="edge">Edge</Option>
                  <Option value="cloud">Cloud</Option>
                  <Option value="flexible">Flexible</Option>
                </Select>
              )}
            </Col>
          </Row>
        </Form.Item>        
      </Form>
    );
  }

  componentDidMount() {
    //add if needed
  }
}

export default Form.create()(SMTForm);
