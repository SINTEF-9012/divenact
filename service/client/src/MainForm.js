import React, { Component } from "react";
import {
  Layout,
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
import { solve } from "./WeightedProductModelSolver";

const { Option } = Select;
const { RangePicker } = DatePicker;
const { Step } = Steps;
const colors = ["blue", "red", "green"];

class MainForm extends Component {
  constructor(props) {
    super(props);

    this.variantColumns = [
      {
        title: "Variant ID",
        dataIndex: "id"
      },
      {
        title: "Template",
        dataIndex: "template",
        render: (text, record) => (
          <Button type="link" onClick={() => this.props.callbackTabChange("1")}>
            {record.template}
          </Button>
        )
      }
    ];
    this.deviceColumns = [
      {
        title: "Device ID",
        dataIndex: "id",
        width: 200,
        render: (text, record) => <span>{record.id}</span>
      }
    ];
    this.state = {
      //add if needed
      matchingDevices: [],
      devices: this.props.devices,
      currentStep: 0,
      selectedVariantRowKeys: [],

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

      lastactive_value: [moment(), moment()],
      lastactive_weight: 5,
      lastactive_toggle: false,

      lastupdate_value: [moment(), moment()],
      lastupdate_weight: 5,
      lastupdate_toggle: false,

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

  next = () => {
    switch (this.state.currentStep) {
      case 0:
        if (
          Array.isArray(this.state.selectedVariantRowKeys) &&
          this.state.selectedVariantRowKeys.length > 0
        ) {
          const currentStep = this.state.currentStep + 1;
          this.setState({ currentStep });
        }
        break;
      case 1:
        this.props.form.validateFields((err, values) => {
          if (!err) {
            console.log("Received form values: ", values);
            console.log("Devices: ", this.props.devices);
            let matchingDevices = solve(values, this.props.devices);
            console.log("Matching devices: ", matchingDevices);
            this.setState({ matchingDevices: matchingDevices });
            console.log(this.state.matchingDevices);
          }
        });
        break;
      case 2:
          this.handleSubmit();
        break;
      default:
    }
  };

  prev = () => {
    const currentStep = this.state.currentStep - 1;
    this.setState({ currentStep });
  };

  onVariantSelectChange = selectedVariantRowKeys => {
    console.log("selectedVariantRowKeys changed: ", selectedVariantRowKeys);
    this.setState({ selectedVariantRowKeys });
  };

  handleSubmit = e => {
    e.preventDefault();
    //TODO deploy
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { myValidateHelp, myValidateStatus } = this.state;
    const { currentStep } = this.state;
    const formItemLayout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 12 }
    };
    const rangeConfig = {
      rules: [{ type: "array", message: "Please select time!" }]
    };
    const { selectedVariantRowKeys } = this.state;
    const variantRowSelection = {
      selectedVariantRowKeys,
      onChange: this.onVariantSelectChange,
      type: "radio"
    };

    const steps = [
      {
        title: "Variants",
        status: "process",
        content: (
          <Table
            //bordered
            rowSelection={variantRowSelection}
            rowKey={record => record.id}
            size="small"
            dataSource={this.props.variants}
            columns={this.variantColumns}
            pagination={{ pageSize: 50 }}
            scroll={{ y: true }}
          />
        )
      },
      {
        title: "Deployment parameters",
        status: "process",
        content: (
          <Form
            {...formItemLayout}
            // onSubmit={this.handleSubmit}
            // onChange = { e =>
            //     console.log("changed", e.target.value)
            // }
            style={{ backgroundColor: "#fff" }}
          >
            <Form.Item
              label={
                <span>
                  <Switch
                    defaultChecked
                    size="small"
                    onClick={() => {
                      this.setState({
                        toggleEnvironment: !this.state.environment_toggle
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
                  {getFieldDecorator("environment.value", {
                    initialValue: this.state.environment_value,
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
                      disabled={this.state.environment_toggle}
                      onChange={e => this.setState({ environment_value: e })}
                    >
                      <Option value="production">Production</Option>
                      <Option value="testing">Testing</Option>
                      <Option value="safe-mode">Safe mode</Option>
                    </Select>
                  )}
                </Col>
                <Col span={2}>
                  {getFieldDecorator("environment.weight", {
                    initialValue: this.state.environment_weight,
                    rules: [
                      {
                        type: "number"
                      }
                    ]
                  })(
                    <Slider
                      min={1}
                      max={10}
                      disabled={this.state.environment_toggle}
                      onChange={value =>
                        this.setState({
                          environment_weight: value
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
                        toggleStatus: !this.state.status_toggle
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
                  {getFieldDecorator("status.value", {
                    initialValue: this.state.status_value,
                    rules: [
                      {
                        message:
                          "Please select target status(es) for a deployment",
                        type: "array"
                      }
                    ]
                  })(
                    <Select
                      mode="multiple"
                      placeholder="Please select target status(es) for a deployment"
                      disabled={this.state.status_toggle}
                      onChange={value => this.setState({ status_value: value })}
                    >
                      <Option value="running">Running</Option>
                      <Option value="failed">Failed</Option>
                      <Option value="suspended">Suspended</Option>
                    </Select>
                  )}
                </Col>
                <Col span={2}>
                  {getFieldDecorator("status.weight", {
                    initialValue: this.state.status_weight,
                    rules: [
                      {
                        type: "number"
                      }
                    ]
                  })(
                    <Slider
                      min={1}
                      max={10}
                      disabled={this.state.status_toggle}
                      onChange={value =>
                        this.setState({
                          status_weight: value
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
                        toggleCapability: !this.state.capability_toggle
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
                  {getFieldDecorator("capability.value", {
                    initialValue: this.state.capability_value,
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
                      disabled={this.state.capability_toggle}
                      onChange={value =>
                        this.setState({ capability_value: value })
                      }
                    >
                      <Option value="sensehat">SenseHat</Option>
                    </Select>
                  )}
                </Col>
                <Col span={2}>
                  {getFieldDecorator("capability.weight", {
                    initialValue: this.state.capability_weight,
                    rules: [
                      {
                        type: "number"
                      }
                    ]
                  })(
                    <Slider
                      min={1}
                      max={10}
                      disabled={this.state.capability_toggle}
                      onChange={value =>
                        this.setState({
                          capability_weight: value
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
                        toggleLastUpdate: !this.state.lastupdate_toggle
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
                  {getFieldDecorator("lastupdate.value", {
                    initialValue: this.state.lastupdate_value
                    //rules: [{ type: "array" }]
                  })(
                    <RangePicker
                      disabled={this.state.lastupdate_toggle}
                      onChange={value =>
                        this.setState({
                          lastupdate_value: value
                        })
                      }
                    />
                  )}
                </Col>
                <Col span={2}>
                  {getFieldDecorator("lastupdate.weight", {
                    initialValue: this.state.lastupdate_weight,
                    rules: [
                      {
                        type: "number"
                      }
                    ]
                  })(
                    <Slider
                      min={1}
                      max={10}
                      disabled={this.state.lastupdate_toggle}
                      onChange={value =>
                        this.setState({
                          lastupdate_weight: value
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
                        toggleLastActive: !this.state.lastactive_toggle
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
                  {getFieldDecorator("lastactive.value", {
                    initialValue: this.state.lastactive_value
                    //rules: [{ type: "array" }]
                  })(
                    <RangePicker
                      disabled={this.state.lastactive_toggle}
                      onChange={value =>
                        this.setState({
                          lastactive_value: value
                        })
                      }
                    />
                  )}
                </Col>
                <Col span={2}>
                  {getFieldDecorator("lastactive.weight", {
                    initialValue: this.state.lastactive_weight,
                    rules: [
                      {
                        type: "number"
                      }
                    ]
                  })(
                    <Slider
                      min={1}
                      max={10}
                      disabled={this.state.lastactive_toggle}
                      onChange={value =>
                        this.setState({
                          lastactive_weight: value
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
                        toggleNetwork: !this.state.toggleNetwork
                      });
                    }}
                  />{" "}
                  Target network connection
                </span>
              }
              help={myValidateHelp}
              validateStatus={myValidateStatus}
            >
              <Row gutter={8}>
                <Col span={21}>
                  {getFieldDecorator("network.value", {
                    initialValue: this.state.network_value,
                    rules: [
                      {
                        message: "Please select target network connection",
                        type: "array"
                      }
                    ]
                  })(
                    <Select
                      mode="multiple"
                      placeholder="Please select target network connection"
                      disabled={this.state.toggleNetwork}
                      onChange={value =>
                        this.setState({ network_value: value })
                      }
                    >
                      <Option value="2g">2G</Option>
                      <Option value="3g">3G</Option>
                      <Option value="4g">4G</Option>
                      <Option value="offline">Offline</Option>
                    </Select>
                  )}
                </Col>
                <Col span={2}>
                  {getFieldDecorator("network.weight", {
                    initialValue: this.state.network_weight,
                    rules: [
                      {
                        type: "number"
                      }
                    ]
                  })(
                    <Slider
                      min={1}
                      max={10}
                      disabled={this.state.toggleNetwork}
                      onChange={value =>
                        this.setState({
                          network_weight: value
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
                        toggleCpu: !this.state.cpu_toggle
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
                  {getFieldDecorator("cpu.value", {
                    initialValue: this.state.cpu_value
                  })(
                    <Slider
                      disabled={this.state.cpu_toggle}
                      onChange={value => this.setState({ cpu_value: value })}
                    />
                  )}
                </Col>
                <Col span={2}>
                  {getFieldDecorator("cpu.weight", {
                    initialValue: this.state.cpu_weight,
                    rules: [
                      {
                        type: "number"
                      }
                    ]
                  })(
                    <Slider
                      min={1}
                      max={10}
                      disabled={this.state.cpu_toggle}
                      onChange={value =>
                        this.setState({
                          cpu_weight: value
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
                        toggleRam: !this.state.ram_toggle
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
                  {getFieldDecorator("ram.value", {
                    initialValue: this.state.ram_value
                  })(
                    <Slider
                      disabled={this.state.ram_toggle}
                      onChange={value => this.setState({ ram_value: value })}
                    />
                  )}
                </Col>
                <Col span={2}>
                  {getFieldDecorator("ram.weight", {
                    initialValue: this.state.ram_weight,
                    rules: [
                      {
                        type: "number"
                      }
                    ]
                  })(
                    <Slider
                      min={1}
                      max={10}
                      disabled={this.state.ram_toggle}
                      onChange={value =>
                        this.setState({
                          ram_weight: value
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
                        toggleStorage: !this.state.storage_toggle
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
                  {getFieldDecorator("storage.value", {
                    initialValue: this.state.storage_value
                  })(
                    <Slider
                      disabled={this.state.storage_toggle}
                      onChange={value =>
                        this.setState({ storage_value: value })
                      }
                    />
                  )}
                </Col>
                <Col span={2}>
                  {getFieldDecorator("storage.weight", {
                    initialValue: this.state.storage_weight,
                    rules: [
                      {
                        type: "number"
                      }
                    ]
                  })(
                    <Slider
                      min={1}
                      max={10}
                      disabled={this.state.storage_toggle}
                      onChange={value =>
                        this.setState({
                          storage_weight: value
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
                        toggleNumber: !this.state.number_toggle
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
                  {getFieldDecorator("number.value", {
                    initialValue: this.state.number_value,
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
                      disabled={this.state.number_toggle}
                      onChange={value => this.setState({ number_value: value })}
                    />
                  )}
                </Col>
                <Col span={2}>
                  {getFieldDecorator("number.weight", {
                    initialValue: this.state.number_weight,
                    rules: [
                      {
                        type: "number"
                      }
                    ]
                  })(
                    <Slider
                      min={1}
                      max={10}
                      disabled={this.state.number_toggle}
                      onChange={value =>
                        this.setState({
                          number_weight: value
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
                        toggleRange: !this.state.range_toggle
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
                  {getFieldDecorator("range.value", {
                    initialValue: this.state.range_value,
                    rules: [
                      {
                        type: "number"
                      }
                    ]
                  })(
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
                      disabled={this.state.range_toggle}
                      onChange={value =>
                        this.setState({
                          range_value: value
                        })
                      }
                    />
                  )}
                </Col>
                <Col span={2}>
                  {getFieldDecorator("range.weight", {
                    initialValue: this.state.range_weight,
                    rules: [
                      {
                        type: "number"
                      }
                    ]
                  })(
                    <Slider
                      min={1}
                      max={10}
                      disabled={this.state.range_toggle}
                      onChange={value =>
                        this.setState({
                          range_weight: value
                        })
                      }
                    />
                  )}
                </Col>
              </Row>
            </Form.Item>

            {/* <Form.Item wrapperCol={{ span: 10, offset: 8 }}>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item> */}
          </Form>
        )
      },
      {
        title: "Affected devices",
        status: "process",
        content: (
          <Table
            //bordered
            //rowSelection={rowSelection}
            rowKey={record => record.id}
            size="small"
            dataSource={this.state.matchingDevices}
            columns={this.deviceColumns}
            pagination={{ pageSize: 50 }}
          />
        )
      }
    ];

    return (
      <div>
        <Row type="flex" justify="center" style={{ marginBottom: 20 }}>
          <Col span={20}>
            <Steps
              current={currentStep}
              type="navigation"
              onChange={this.onStepChange}
            >
              {steps.map(item => (
                <Step key={item.title} title={item.title} />
              ))}
            </Steps>
          </Col>
        </Row>
        <Row type="flex" justify="center">
          <Col span={16}>
            <div className="steps-content">{steps[currentStep].content}</div>
            <div className="steps-action" align="center">
              {currentStep > 0 && (
                <Button onClick={() => this.prev()}>Previous</Button>
              )}
              {currentStep < steps.length - 1 && (
                <Button
                  style={{ marginLeft: 8 }}
                  type="primary"
                  onClick={() => this.next()}
                >
                  Next
                </Button>
              )}
              {currentStep === steps.length - 1 && (
                <Button
                  style={{ marginLeft: 8 }}
                  type="primary"
                  onClick={() => message.success("Processing complete!")}
                >
                  Deploy
                </Button>
              )}
            </div>
          </Col>
        </Row>
      </div>

      //   <div>
      //     <Row type="flex" justify="center" style={{ marginBottom: 20 }}>
      //       <Col span={20}>
      //         <Steps
      //           current={currentStep}
      //           type="navigation"
      //           onChange={this.onStepChange}
      //         >
      //           {/* {steps.map(item => (
      //             <Step key={item.title} title={item.title} />
      //           ))} */}
      //           <Step key="1" title="Variants">
      //             TEST 1
      //           </Step>
      //           <Step key="2" title="Deployment parameters">
      //             TEST 2
      //           </Step>
      //           <Step key="3" title="Affected devices">
      //             TEST 3
      //           </Step>
      //         </Steps>
      //       </Col>
      //     </Row>
      //     <Row type="flex" justify="center">
      //       <Col span={16}>
      //         {/* <div className="steps-content">{steps[currentStep].content}</div> */}
      //         <div className="steps-action" align="center">
      //           {currentStep > 0 && (
      //             <Button onClick={() => this.prev()}>Previous</Button>
      //           )}
      //           {currentStep < 2 && (
      //             <Button
      //               style={{ marginLeft: 8 }}
      //               type="primary"
      //               onClick={() => this.next()}
      //             >
      //               Next
      //             </Button>
      //           )}
      //           {currentStep === 2 && (
      //             <Button
      //               style={{ marginLeft: 8 }}
      //               type="primary"
      //               onClick={() => message.success("Processing complete!")}
      //             >
      //               Deploy
      //             </Button>
      //           )}
      //         </div>
      //       </Col>
      //     </Row>
      //   </div>

      //   {/* <Form
      //     {...formItemLayout}
      //     // onSubmit={this.handleSubmit}
      //     style={{ backgroundColor: "#fff" }}
      //   >
      //     <Form.Item
      //       label={
      //         <span>
      //           <Switch
      //             defaultChecked
      //             size="small"
      //             onClick={() => {
      //               this.setState({
      //                 toggleEnvironment: !this.state.toggleEnvironment
      //               });
      //             }}
      //           />{" "}
      //           Target environment
      //         </span>
      //       }
      //       help={myValidateHelp}
      //       validateStatus={myValidateStatus}
      //     >
      //       <Row gutter={8}>
      //         <Col span={21}>
      //           {getFieldDecorator("environment.value", {
      //             rules: [
      //               {
      //                 message:
      //                   "Please select target environment(s) for a deployment",
      //                 type: "array"
      //               }
      //             ]
      //           })(
      //             <Select
      //               mode="multiple"
      //               placeholder="Please select target environment(s) for a deployment"
      //               disabled={this.state.toggleEnvironment}
      //             >
      //               <Option value="production">Production</Option>
      //               <Option value="testing">Testing</Option>
      //               <Option value="safe-mode">Safe mode</Option>
      //             </Select>
      //           )}
      //         </Col>
      //         <Col span={2}>
      //           {getFieldDecorator("environment.weight", {
      //             initialValue: this.state.environment.weight,
      //             rules: [
      //               {
      //                 type: "number"
      //               }
      //             ]
      //           })(
      //             <Slider
      //               min={1}
      //               max={10}
      //               disabled={this.state.toggleEnvironment}
      //               onChange={value =>
      //                 this.setState({
      //                   environment: { weight: value }
      //                 })
      //               }
      //             />
      //           )}
      //         </Col>
      //       </Row>
      //     </Form.Item>

      //     <Form.Item
      //       label={
      //         <span>
      //           <Switch
      //             defaultChecked
      //             size="small"
      //             onClick={() => {
      //               this.setState({
      //                 toggleStatus: !this.state.toggleStatus
      //               });
      //             }}
      //           />{" "}
      //           Target status
      //         </span>
      //       }
      //       help={myValidateHelp}
      //       validateStatus={myValidateStatus}
      //     >
      //       <Row gutter={8}>
      //         <Col span={21}>
      //           {getFieldDecorator("status.value", {
      //             rules: [
      //               {
      //                 message: "Please select target status(es) for a deployment",
      //                 type: "array"
      //               }
      //             ]
      //           })(
      //             <Select
      //               mode="multiple"
      //               placeholder="Please select target status(es) for a deployment"
      //               disabled={this.state.toggleStatus}
      //             >
      //               <Option value="running">Running</Option>
      //               <Option value="failed">Failed</Option>
      //               <Option value="suspended">Suspended</Option>
      //             </Select>
      //           )}
      //         </Col>
      //         <Col span={2}>
      //           {getFieldDecorator("status.weight", {
      //             initialValue: this.state.status.weight,
      //             rules: [
      //               {
      //                 type: "number"
      //               }
      //             ]
      //           })(
      //             <Slider
      //               min={1}
      //               max={10}
      //               disabled={this.state.toggleStatus}
      //               onChange={value =>
      //                 this.setState({
      //                   status: { weight: value }
      //                 })
      //               }
      //             />
      //           )}
      //         </Col>
      //       </Row>
      //     </Form.Item>

      //     <Form.Item
      //       label={
      //         <span>
      //           <Switch
      //             defaultChecked
      //             size="small"
      //             onClick={() => {
      //               this.setState({
      //                 toggleCapability: !this.state.toggleCapability
      //               });
      //             }}
      //           />{" "}
      //           Target capability
      //         </span>
      //       }
      //       help={myValidateHelp}
      //       validateStatus={myValidateStatus}
      //     >
      //       <Row gutter={8}>
      //         <Col span={21}>
      //           {getFieldDecorator("capability.value", {
      //             rules: [
      //               {
      //                 message:
      //                   "Please select target device capability(ies) for a deployment",
      //                 type: "array"
      //               }
      //             ]
      //           })(
      //             <Select
      //               mode="multiple"
      //               placeholder="Please select target device capability(ies) for a deployment"
      //               disabled={this.state.toggleCapability}
      //             >
      //               <Option value="sensehat">SenseHat</Option>
      //             </Select>
      //           )}
      //         </Col>
      //         <Col span={2}>
      //           {getFieldDecorator("capability.weight", {
      //             initialValue: this.state.capability.weight,
      //             rules: [
      //               {
      //                 type: "number"
      //               }
      //             ]
      //           })(
      //             <Slider
      //               min={1}
      //               max={10}
      //               disabled={this.state.toggleCapability}
      //               onChange={value =>
      //                 this.setState({
      //                   capability: { weight: value }
      //                 })
      //               }
      //             />
      //           )}
      //         </Col>
      //       </Row>
      //     </Form.Item>

      //     <Form.Item
      //       label={
      //         <span>
      //           <Switch
      //             defaultChecked
      //             size="small"
      //             onClick={() => {
      //               this.setState({
      //                 toggleLastUpdate: !this.state.toggleLastUpdate
      //               });
      //             }}
      //           />{" "}
      //           Last Update
      //         </span>
      //       }
      //       help={myValidateHelp}
      //       validateStatus={myValidateStatus}
      //     >
      //       <Row gutter={8}>
      //         <Col span={21}>
      //           {getFieldDecorator("lastupdate.value", {
      //             rules: [{ type: "array" }]
      //           })(
      //             <RangePicker
      //               disabled={this.state.toggleLastUpdate}
      //               onChange={value =>
      //                 this.setState({
      //                   lastupdate: { value: value }
      //                 })
      //               }
      //             />
      //           )}
      //         </Col>
      //         <Col span={2}>
      //           {getFieldDecorator("lastupdate.weight", {
      //             initialValue: this.state.lastupdate.weight,
      //             rules: [
      //               {
      //                 type: "number"
      //               }
      //             ]
      //           })(
      //             <Slider
      //               min={1}
      //               max={10}
      //               disabled={this.state.toggleLastUpdate}
      //               onChange={value =>
      //                 this.setState({
      //                   lastupdate: { weight: value }
      //                 })
      //               }
      //             />
      //           )}
      //         </Col>
      //       </Row>
      //     </Form.Item>

      //     <Form.Item
      //       label={
      //         <span>
      //           <Switch
      //             defaultChecked
      //             size="small"
      //             onClick={() => {
      //               this.setState({
      //                 toggleLastActive: !this.state.toggleLastActive
      //               });
      //             }}
      //           />{" "}
      //           Last Active
      //         </span>
      //       }
      //       help={myValidateHelp}
      //       validateStatus={myValidateStatus}
      //     >
      //       <Row gutter={8}>
      //         <Col span={21}>
      //           {getFieldDecorator("lastactive.value")(
      //             <RangePicker
      //               disabled={this.state.toggleLastActive}
      //               onChange={value =>
      //                 this.setState({
      //                   lastactive: { value: value }
      //                 })
      //               }
      //             />
      //           )}
      //         </Col>
      //         <Col span={2}>
      //           {getFieldDecorator("lastactive.weight", {
      //             initialValue: this.state.lastactive.weight,
      //             rules: [
      //               {
      //                 type: "number"
      //               }
      //             ]
      //           })(
      //             <Slider
      //               min={1}
      //               max={10}
      //               disabled={this.state.toggleLastActive}
      //               onChange={value =>
      //                 this.setState({
      //                   lastactive: { weight: value }
      //                 })
      //               }
      //             />
      //           )}
      //         </Col>
      //       </Row>
      //     </Form.Item>

      //     <Form.Item
      //       label={
      //         <span>
      //           <Switch
      //             defaultChecked
      //             size="small"
      //             onClick={() => {
      //               this.setState({
      //                 toggleCpu: !this.state.toggleCpu
      //               });
      //             }}
      //           />{" "}
      //           CPU
      //         </span>
      //       }
      //       help={myValidateHelp}
      //       validateStatus={myValidateStatus}
      //     >
      //       <Row gutter={8}>
      //         <Col span={21}>
      //           {getFieldDecorator("cpu.value", {
      //             initialValue: 10
      //           })(<Slider disabled={this.state.toggleCpu} />)}
      //         </Col>
      //         <Col span={2}>
      //           {getFieldDecorator("cpu.weight", {
      //             initialValue: this.state.cpu.weight,
      //             rules: [
      //               {
      //                 type: "number"
      //               }
      //             ]
      //           })(
      //             <Slider
      //               min={1}
      //               max={10}
      //               disabled={this.state.toggleCpu}
      //               onChange={value =>
      //                 this.setState({
      //                   cpu: { weight: value }
      //                 })
      //               }
      //             />
      //           )}
      //         </Col>
      //       </Row>
      //     </Form.Item>

      //     <Form.Item
      //       label={
      //         <span>
      //           <Switch
      //             defaultChecked
      //             size="small"
      //             onClick={() => {
      //               this.setState({
      //                 toggleRam: !this.state.toggleRam
      //               });
      //             }}
      //           />{" "}
      //           RAM
      //         </span>
      //       }
      //       help={myValidateHelp}
      //       validateStatus={myValidateStatus}
      //     >
      //       <Row gutter={8}>
      //         <Col span={21}>
      //           {getFieldDecorator("ram.value", {
      //             initialValue: 20
      //           })(<Slider disabled={this.state.toggleRam} />)}
      //         </Col>
      //         <Col span={2}>
      //           {getFieldDecorator("ram.weight", {
      //             initialValue: this.state.ram.weight,
      //             rules: [
      //               {
      //                 type: "number"
      //               }
      //             ]
      //           })(
      //             <Slider
      //               min={1}
      //               max={10}
      //               disabled={this.state.toggleRam}
      //               onChange={value =>
      //                 this.setState({
      //                   ram: { weight: value }
      //                 })
      //               }
      //             />
      //           )}
      //         </Col>
      //       </Row>
      //     </Form.Item>

      //     <Form.Item
      //       label={
      //         <span>
      //           <Switch
      //             defaultChecked
      //             size="small"
      //             onClick={() => {
      //               this.setState({
      //                 toggleStorage: !this.state.toggleStorage
      //               });
      //             }}
      //           />{" "}
      //           Storage
      //         </span>
      //       }
      //       help={myValidateHelp}
      //       validateStatus={myValidateStatus}
      //     >
      //       <Row gutter={8}>
      //         <Col span={21}>
      //           {getFieldDecorator("storage.value", {
      //             initialValue: 30
      //           })(<Slider disabled={this.state.toggleStorage} />)}
      //         </Col>
      //         <Col span={2}>
      //           {getFieldDecorator("storage.weight", {
      //             initialValue: this.state.storage.weight,
      //             rules: [
      //               {
      //                 type: "number"
      //               }
      //             ]
      //           })(
      //             <Slider
      //               min={1}
      //               max={10}
      //               disabled={this.state.toggleStorage}
      //               onChange={value =>
      //                 this.setState({
      //                   storage: { weight: value }
      //                 })
      //               }
      //             />
      //           )}
      //         </Col>
      //       </Row>
      //     </Form.Item>

      //     <Form.Item
      //       label={
      //         <span>
      //           <Switch
      //             defaultChecked
      //             size="small"
      //             onClick={() => {
      //               this.setState({
      //                 toggleNumber: !this.state.toggleNumber
      //               });
      //             }}
      //           />{" "}
      //           Number of Devices
      //         </span>
      //       }
      //       help={myValidateHelp}
      //       validateStatus={myValidateStatus}
      //     >
      //       <Row gutter={8}>
      //         <Col span={21}>
      //           {getFieldDecorator("number.value", {
      //             initialValue: 10,
      //             rules: [
      //               {
      //                 message: "Please select the number of target devices",
      //                 type: "number"
      //               }
      //             ]
      //           })(
      //             <InputNumber
      //               min={1}
      //               max={100}
      //               disabled={this.state.toggleNumber}
      //             />
      //           )}
      //         </Col>
      //         <Col span={2}>
      //           {getFieldDecorator("number.weight", {
      //             initialValue: this.state.number.weight,
      //             rules: [
      //               {
      //                 type: "number"
      //               }
      //             ]
      //           })(
      //             <Slider
      //               min={1}
      //               max={10}
      //               disabled={this.state.toggleNumber}
      //               onChange={value =>
      //                 this.setState({
      //                   number: { weight: value }
      //                 })
      //               }
      //             />
      //           )}
      //         </Col>
      //       </Row>
      //     </Form.Item>

      //     <Form.Item
      //       label={
      //         <span>
      //           <Switch
      //             defaultChecked
      //             size="small"
      //             onClick={() => {
      //               this.setState({
      //                 toggleRange: !this.state.toggleRange
      //               });
      //             }}
      //           />{" "}
      //           Deployment Range
      //         </span>
      //       }
      //       help={myValidateHelp}
      //       validateStatus={myValidateStatus}
      //     >
      //       <Row gutter={8}>
      //         <Col span={21}>
      //           {getFieldDecorator("range.value")(
      //             <Slider
      //               marks={{
      //                 0: "0 km",
      //                 10: "10 km",
      //                 20: "20 km",
      //                 30: "30 km",
      //                 40: "40 km",
      //                 50: "50 km",
      //                 60: "60 km",
      //                 70: "70 km",
      //                 80: "80 km",
      //                 90: "90  km",
      //                 100: "100 km"
      //               }}
      //               disabled={this.state.toggleRange}
      //               onChange={value =>
      //                 this.setState({
      //                   range: { value: value }
      //                 })
      //               }
      //             />
      //           )}
      //         </Col>
      //         <Col span={2}>
      //           {getFieldDecorator("range.weight", {
      //             initialValue: this.state.range.weight,
      //             rules: [
      //               {
      //                 type: "number"
      //               }
      //             ]
      //           })(
      //             <Slider
      //               min={1}
      //               max={10}
      //               disabled={this.state.toggleRange}
      //               onChange={value =>
      //                 this.setState({
      //                   range: { weight: value }
      //                 })
      //               }
      //             />
      //           )}
      //         </Col>
      //       </Row>
      //     </Form.Item>

      //     {/* <Form.Item wrapperCol={{ span: 10, offset: 8 }}>
      //         <Button type="primary" htmlType="submit">
      //           Submit
      //         </Button>
      //       </Form.Item> */}
      //   </Form> */}
    );
  }

  componentDidMount() {
    //add if needed
  }
}

export default Form.create()(MainForm);
