import React, { Component } from "react";
import axios from "axios";
import {
  Form,
  Input,
  Select,
  InputNumber,
  DatePicker,
  Switch,
  Slider,
  Button,
  Row,
  Col
} from "antd";

const { Option } = Select;

class DiversifyArea extends Component {
  constructor(props) {
    super(props);
    this.state = {
      //add if needed
      valueEnvironment: 5,
      valueStatus: 5,
      valueCapability: 5,
      valueLastActive: 5,
      valueLastUpdate: 5,
      valueCpu: 5,
      valueRam: 5,
      valueStorage: 5,
      valueNumber: 5,
      valueRange: 5,
      toggleEnvironment: false,
      toggleStatus: false,
      toggleCapability: false,
      toggleLastActive: false,
      toggleLastUpdate: false,
      toggleCpu: false,
      toggleRam: false,
      toggleStorage: false,
      toggleNumber: false,
      toggleRange: false,
      myValidateHelp: "Validation help",
      myValidateStatus: "Validation status"
    };
  }

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log("Received values of form: ", values);
        console.log("Devices: " + this.props.devices);
      }
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { myValidateHelp, myValidateStatus } = this.state;
    const formItemLayout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 12 }
    };
    return (
      <Form {...formItemLayout} onSubmit={this.handleSubmit}>
        <Form.Item
          label={
            <span>
              <Switch
                defaultChecked
                size="small"
                onClick={() => {
                  this.setState({
                    toggleEnvironment: !this.state.toggleEnvironment
                  });
                }}
              />{" "}
              Target environment
            </span>
          }
          help={myValidateHelp}
          validateStatus={myValidateStatus}
        >
          <Row gutter={8}>
            <Col span={21}>
              {getFieldDecorator("environment", {
                rules: [
                  {
                    message:
                      "Please select target environment(s) for a deployment",
                    type: "array"
                  }
                ]
              })(
                <Select
                  mode="multiple"
                  placeholder="Please select target environment(s) for a deployment"
                  disabled={this.state.toggleEnvironment}
                >
                  <Option value="production">Production</Option>
                  <Option value="testing">Testing</Option>
                  <Option value="safe-mode">Safe mode</Option>
                </Select>
              )}
            </Col>
            <Col span={2}>
              {getFieldDecorator("weightEnvironment", {
                initialValue: this.state.valueEnvironment,
                rules: [
                  {
                    type: "number"
                  }
                ]
              })(
                <Slider
                  min={1}
                  max={10}
                  disabled={this.state.toggleEnvironment}
                  onChange={value =>
                    this.setState({
                      valueEnvironment: value
                    })
                  }
                />
              )}
            </Col>
          </Row>
        </Form.Item>

        <Form.Item
          label={
            <span>
              <Switch
                defaultChecked
                size="small"
                onClick={() => {
                  this.setState({
                    toggleStatus: !this.state.toggleStatus
                  });
                }}
              />{" "}
              Target status
            </span>
          }
          help={myValidateHelp}
          validateStatus={myValidateStatus}
        >
          <Row gutter={8}>
            <Col span={21}>
              {getFieldDecorator("status", {
                rules: [
                  {
                    message: "Please select target status(es) for a deployment",
                    type: "array"
                  }
                ]
              })(
                <Select
                  mode="multiple"
                  placeholder="Please select target status(es) for a deployment"
                  disabled={this.state.toggleStatus}
                >
                  <Option value="running">Running</Option>
                  <Option value="failed">Failed</Option>
                  <Option value="suspended">Suspended</Option>
                </Select>
              )}
            </Col>
            <Col span={2}>
              {getFieldDecorator("weightStatus", {
                initialValue: this.state.valueStatus,
                rules: [
                  {
                    type: "number"
                  }
                ]
              })(
                <Slider
                  min={1}
                  max={10}
                  disabled={this.state.toggleStatus}
                  onChange={value =>
                    this.setState({
                      valueStatus: value
                    })
                  }
                />
              )}
            </Col>
          </Row>
        </Form.Item>

        <Form.Item
          label={
            <span>
              <Switch
                defaultChecked
                size="small"
                onClick={() => {
                  this.setState({
                    toggleCapability: !this.state.toggleCapability
                  });
                }}
              />{" "}
              Target capability
            </span>
          }
          help={myValidateHelp}
          validateStatus={myValidateStatus}
        >
          <Row gutter={8}>
            <Col span={21}>
              {getFieldDecorator("capability", {
                rules: [
                  {
                    message:
                      "Please select target device capability(ies) for a deployment",
                    type: "array"
                  }
                ]
              })(
                <Select
                  mode="multiple"
                  placeholder="Please select target device capability(ies) for a deployment"
                  disabled={this.state.toggleCapability}
                >
                  <Option value="sensehat">SenseHat</Option>
                </Select>
              )}
            </Col>
            <Col span={2}>
              {getFieldDecorator("weightCapability", {
                initialValue: this.state.valueCapability,
                rules: [
                  {
                    type: "number"
                  }
                ]
              })(
                <Slider
                  min={1}
                  max={10}
                  disabled={this.state.toggleCapability}
                  onChange={value =>
                    this.setState({
                      valueCapability: value
                    })
                  }
                />
              )}
            </Col>
          </Row>
        </Form.Item>

        <Form.Item
          label={
            <span>
              <Switch
                defaultChecked
                size="small"
                onClick={() => {
                  this.setState({
                    toggleLastUpdate: !this.state.toggleLastUpdate
                  });
                }}
              />{" "}
              Last Update
            </span>
          }
          help={myValidateHelp}
          validateStatus={myValidateStatus}
        >
          <Row gutter={8}>
            <Col span={21}>
              {getFieldDecorator("lastUpdate")(
                <DatePicker
                  onChange={this.onLastUpdateDateChange}
                  disabled={this.state.toggleLastUpdate}
                />
              )}
            </Col>
            <Col span={2}>
              {getFieldDecorator("weightLastUpdate", {
                initialValue: this.state.valueLastUpdate,
                rules: [
                  {
                    type: "number"
                  }
                ]
              })(
                <Slider
                  min={1}
                  max={10}
                  disabled={this.state.toggleLastUpdate}
                  onChange={value =>
                    this.setState({
                      valueLastUpdate: value
                    })
                  }
                />
              )}
            </Col>
          </Row>
        </Form.Item>

        <Form.Item
          label={
            <span>
              <Switch
                defaultChecked
                size="small"
                onClick={() => {
                  this.setState({
                    toggleLastActive: !this.state.toggleLastActive
                  });
                }}
              />{" "}
              Last Active
            </span>
          }
          help={myValidateHelp}
          validateStatus={myValidateStatus}
        >
          <Row gutter={8}>
            <Col span={21}>
              {getFieldDecorator("lastActive")(
                <DatePicker
                  onChange={this.onLastActiveDateChange}
                  disabled={this.state.toggleLastActive}
                />
              )}
            </Col>
            <Col span={2}>
              {getFieldDecorator("weightLastActive", {
                initialValue: this.state.valueLastActive,
                rules: [
                  {
                    type: "number"
                  }
                ]
              })(
                <Slider
                  min={1}
                  max={10}
                  disabled={this.state.toggleLastActive}
                  onChange={value =>
                    this.setState({
                      valueLastActive: value
                    })
                  }
                />
              )}
            </Col>
          </Row>
        </Form.Item>

        <Form.Item
          label={
            <span>
              <Switch
                defaultChecked
                size="small"
                onClick={() => {
                  this.setState({
                    toggleCpu: !this.state.toggleCpu
                  });
                }}
              />{" "}
              CPU
            </span>
          }
          help={myValidateHelp}
          validateStatus={myValidateStatus}
        >
          <Row gutter={8}>
            <Col span={21}>
              {getFieldDecorator("cpu", {
                initialValue: 10
              })(<Slider disabled={this.state.toggleCpu} />)}
            </Col>
            <Col span={2}>
              {getFieldDecorator("weightCpu", {
                initialValue: this.state.valueCpu,
                rules: [
                  {
                    type: "number"
                  }
                ]
              })(
                <Slider
                  min={1}
                  max={10}
                  disabled={this.state.toggleCpu}
                  onChange={value =>
                    this.setState({
                      valueCpu: value
                    })
                  }
                />
              )}
            </Col>
          </Row>
        </Form.Item>

        <Form.Item
          label={
            <span>
              <Switch
                defaultChecked
                size="small"
                onClick={() => {
                  this.setState({
                    toggleRam: !this.state.toggleRam
                  });
                }}
              />{" "}
              RAM
            </span>
          }
          help={myValidateHelp}
          validateStatus={myValidateStatus}
        >
          <Row gutter={8}>
            <Col span={21}>
              {getFieldDecorator("ram", {
                initialValue: 20
              })(<Slider disabled={this.state.toggleRam} />)}
            </Col>
            <Col span={2}>
              {getFieldDecorator("weightRam", {
                initialValue: this.state.valueRam,
                rules: [
                  {
                    type: "number"
                  }
                ]
              })(
                <Slider
                  min={1}
                  max={10}
                  disabled={this.state.toggleRam}
                  onChange={value =>
                    this.setState({
                      valueRam: value
                    })
                  }
                />
              )}
            </Col>
          </Row>
        </Form.Item>

        <Form.Item
          label={
            <span>
              <Switch
                defaultChecked
                size="small"
                onClick={() => {
                  this.setState({
                    toggleStorage: !this.state.toggleStorage
                  });
                }}
              />{" "}
              Storage
            </span>
          }
          help={myValidateHelp}
          validateStatus={myValidateStatus}
        >
          <Row gutter={8}>
            <Col span={21}>
              {getFieldDecorator("storage", {
                initialValue: 30
              })(<Slider disabled={this.state.toggleStorage} />)}
            </Col>
            <Col span={2}>
              {getFieldDecorator("weightStorage", {
                initialValue: this.state.valueStorage,
                rules: [
                  {
                    type: "number"
                  }
                ]
              })(
                <Slider
                  min={1}
                  max={10}
                  disabled={this.state.toggleStorage}
                  onChange={value =>
                    this.setState({
                      valueStorage: value
                    })
                  }
                />
              )}
            </Col>
          </Row>
        </Form.Item>

        <Form.Item
          label={
            <span>
              <Switch
                defaultChecked
                size="small"
                onClick={() => {
                  this.setState({
                    toggleNumber: !this.state.toggleNumber
                  });
                }}
              />{" "}
              Number of Devices
            </span>
          }
          help={myValidateHelp}
          validateStatus={myValidateStatus}
        >
          <Row gutter={8}>
            <Col span={21}>
              {getFieldDecorator("number", {
                initialValue: 10,
                rules: [
                  {
                    message: "Please select the number of target devices",
                    type: "number"
                  }
                ]
              })(
                <InputNumber
                  min={1}
                  max={100}
                  disabled={this.state.toggleNumber}
                />
              )}
            </Col>
            <Col span={2}>
              {getFieldDecorator("weightNumber", {
                initialValue: this.state.valueNumber,
                rules: [
                  {
                    type: "number"
                  }
                ]
              })(
                <Slider
                  min={1}
                  max={10}
                  disabled={this.state.toggleNumber}
                  onChange={value =>
                    this.setState({
                      valueNumber: value
                    })
                  }
                />
              )}
            </Col>
          </Row>
        </Form.Item>

        <Form.Item
          label={
            <span>
              <Switch
                defaultChecked
                size="small"
                onClick={() => {
                  this.setState({
                    toggleRange: !this.state.toggleRange
                  });
                }}
              />{" "}
              Deployment Range
            </span>
          }
          help={myValidateHelp}
          validateStatus={myValidateStatus}
        >
          <Row gutter={8}>
            <Col span={21}>
              {getFieldDecorator("range")(
                <Slider
                  marks={{
                    0: "0 km",
                    10: "10 km",
                    20: "20 km",
                    30: "30 km",
                    40: "40 km",
                    50: "50 km",
                    60: "60 km",
                    70: "70 km",
                    80: "80 km",
                    90: "90  km",
                    100: "100 km"
                  }}
                  disabled={this.state.toggleRange}
                />
              )}
            </Col>
            <Col span={2}>
              {getFieldDecorator("weightRange", {
                initialValue: this.state.valueRange,
                rules: [
                  {
                    type: "number"
                  }
                ]
              })(
                <Slider
                  min={1}
                  max={10}
                  disabled={this.state.toggleRange}
                  onChange={value =>
                    this.setState({
                      valueRange: value
                    })
                  }
                />
              )}
            </Col>
          </Row>
        </Form.Item>

        <Form.Item wrapperCol={{ span: 10, offset: 8 }}>
          <Button type="primary" htmlType="submit">
            Diversify
          </Button>
        </Form.Item>
      </Form>
    );
  }

  componentDidMount() {
    //add if needed
  }

  toggleSwitch = element => {
    console.log(element);
    this.setState({
      element
    });
  };

  onLastUpdateDateChange = (date, dateString) => {
    console.log(date, dateString);
  };

  /**
   * Tag selected device (e.g. to put it into a safe mode)
   */
  tagDevice = async (device, tags) => {
    let result = await axios.put("api/device/" + device, tags);
  };

  /**
   * Tag all devices affected by a deployment (e.g. to put it into a safe mode)
   */
  tagDevices = async (device, tags) => {
    let faultyDeployments = this.props.activeDeployments[device];
    console.log("deployments" + JSON.stringify(faultyDeployments));
    faultyDeployments.forEach(deployment => {
      let faultyDevices = this.props.appliedDevices[deployment];
      console.log(this.props.appliedDevices[deployment]);
      faultyDevices.forEach(fDevice => {
        console.log(fDevice.deviceId);
        this.tagDevice(fDevice.deviceId, tags);
      });
    });
  };
}

export default Form.create()(DiversifyArea);
