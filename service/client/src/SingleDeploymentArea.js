import React, { Component } from "react";
import ReactJson from "react-json-view";
import axios from "axios";
//import {cube} from "./Solver";
import {
  Form,
  Select,
  InputNumber,
  DatePicker,
  Switch,
  Slider,
  Button,
  Icon,
  Rate,
  Checkbox,
  Row,
  Col
} from "antd";

const { Option } = Select;

//const { Content } = Layout;
//const ButtonGroup = Button.Group;
//const colors = ["blue","red","green"];

class DiversifyArea extends Component {
  constructor(props) {
    super(props);
    this.state = {
      //add if needed
      inputValue: 1,
      toggleEnvironment: false,
      toggleStatus: false,
      toggleLastActive: false,
      toggleLastUpdate: false,
      toggleCapability: false,
      toggleCpu: false,
      toggleRam: false,
      toggleStorage: false,
      toggleNumber: false,
      toggleRange: false
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
    //const { inputValue } = this.state;
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 12 }
    };
    return (
      <Form {...formItemLayout} onSubmit={this.handleSubmit}>
        <Form.Item label="Target environment">
          <Row gutter={8}>
            <Col span={22}>
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
              {/* {getFieldDecorator("environmentToggle", { valuePropName: "checked" })( */}
              <Switch defaultChecked 
                size="small"
                onClick={() => {
                  this.setState({
                    toggleEnvironment: !this.state.toggleEnvironment
                  });
                }}
              />
              {/* )} */}
            </Col>
          </Row>
        </Form.Item>

        <Form.Item label="Target status">
          <Row gutter={8}>
            <Col span={22}>
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
              <Switch defaultChecked 
                size="small"
                onClick={() => {
                  this.setState({ toggleStatus: !this.state.toggleStatus });
                }}
              />
            </Col>
          </Row>
        </Form.Item>

        <Form.Item label="Target capability">
          <Row gutter={8}>
            <Col span={22}>
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
              <Switch defaultChecked 
                size="small"
                onClick={() => {
                  this.setState({
                    toggleCapability: !this.state.toggleCapability
                  });
                }}
              />
            </Col>
          </Row>
        </Form.Item>

        <Form.Item label="Last Update">
          <Row gutter={8}>
            <Col span={22}>
              {getFieldDecorator("lastUpdate")(
                <DatePicker onChange={this.onLastUpdateDateChange} 
                disabled={this.state.toggleLastUpdate} />
              )}
            </Col>
            <Col span={2}>
              <Switch defaultChecked 
                size="small"
                onClick={() => {
                  this.setState({
                    toggleLastUpdate: !this.state.toggleLastUpdate
                  });
                }}
              />
            </Col>
          </Row>
        </Form.Item>

        <Form.Item label="Last Active">
          <Row gutter={8}>
            <Col span={22}>
              {getFieldDecorator("lastActive")(
                <DatePicker onChange={this.onLastActiveDateChange} 
                disabled={this.state.toggleLastActive} />
              )}
            </Col>
            <Col span={2}>
              <Switch defaultChecked 
                size="small"
                onClick={() => {
                  this.setState({
                    toggleLastActive: !this.state.toggleLastActive
                  });
                }}
              />
            </Col>
          </Row>
        </Form.Item>

        <Form.Item label="CPU">
          <Row gutter={8}>
            <Col span={22}>
              {getFieldDecorator("cpu", {
                initialValue: 10
              })(<Slider disabled={this.state.toggleCpu} />)}
            </Col>
            <Col span={2}>
              <Switch defaultChecked 
                size="small"
                onClick={() => {
                  this.setState({ toggleCpu: !this.state.toggleCpu });
                }}
              />
            </Col>
          </Row>
        </Form.Item>

        <Form.Item label="RAM">
          <Row gutter={8}>
            <Col span={22}>
              {getFieldDecorator("ram", {
                initialValue: 20
              })(<Slider disabled={this.state.toggleRam} />)}
            </Col>
            <Col span={2}>
              <Switch defaultChecked 
                size="small"
                onClick={() => {
                  this.setState({ toggleRam: !this.state.toggleRam });
                }}
              />
            </Col>
          </Row>
        </Form.Item>

        <Form.Item label="Storage">
          <Row gutter={8}>
            <Col span={22}>
              {getFieldDecorator("storage", {
                initialValue: 30
              })(<Slider disabled={this.state.toggleStorage}/>)}
            </Col>
            <Col span={2}>
              <Switch defaultChecked 
                size="small"
                onClick={() => {
                  this.setState({ toggleStorage: !this.state.toggleStorage });
                }}
              />
            </Col>
          </Row>
        </Form.Item>

        <Form.Item label="Number of devices">
          <Row gutter={8}>
            <Col span={22}>
              {getFieldDecorator("number", {
                initialValue: 10,
                rules: [
                  {
                    message: "Please select the number of target devices",
                    type: "number"
                  }
                ]
              })(<InputNumber min={1} max={100} disabled={this.state.toggleNumber} />)}
            </Col>
            <Col span={2}>
              <Switch defaultChecked 
                size="small"
                onClick={() => {
                  this.setState({ toggleNumber: !this.state.toggleNumber });
                }}
              />
            </Col>
          </Row>
        </Form.Item>

        <Form.Item label="Deployment range">
          <Row gutter={8}>
            <Col span={22}>
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
              <Switch defaultChecked 
                size="small"
                onClick={() => {
                  this.setState({ toggleRange: !this.state.toggleRange });
                }}
              />
            </Col>
          </Row>
        </Form.Item>

        <Form.Item wrapperCol={{ span: 12, offset: 6 }}>
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
