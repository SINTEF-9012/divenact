import React, { Component } from "react";
import ReactJson from "react-json-view";
import axios from "axios";
import * as kiwi from "kiwi.js";
import cassowary from "cassowary";
//import {cube} from "./Solver";
import {
  Form,
  Select,
  InputNumber,
  Switch,
  Radio,
  Slider,
  Button,
  Upload,
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
    };
  }

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log("Received values of form: ", values);
        console.log("Devices: " + this.props.devices);
        //console.log(cube(3));

        //var environment = this.props.deviceTags[record.id]

        var solver = new kiwi.Solver();
        
        var target_environment = new kiwi.Variable();
        var target_status = new kiwi.Variable();
        var target_capability = new kiwi.Variable();

        var environment = new kiwi.Variable();
        var status = new kiwi.Variable();
        var capability = new kiwi.Variable();

        var range = new kiwi.Variable();
        var number = new kiwi.Variable();
        
        solver.addEditVariable(range, kiwi.Strength.required);
        solver.addEditVariable(number, kiwi.Strength.required);
                
        //solver.suggestValue(left, 100);
        //solver.suggestValue(width, 400);

        solver.addConstraint(new kiwi.Constraint(new kiwi.Expression([-1, environment], target_environment), kiwi.Operator.Eq));
        solver.addConstraint(new kiwi.Constraint(new kiwi.Expression([-1, status], target_status), kiwi.Operator.Eq));
        solver.addConstraint(new kiwi.Constraint(new kiwi.Expression([-1, capability], target_capability), kiwi.Operator.Eq));
        
        
        console.log(target_environment.value);
        console.log(target_status.value);
        console.log(target_capability.value);

        var constraints = [
          new cassowary.Inequality(target_environment, cassowary.GEQ, 1, cassowary.Strength.required),
          new cassowary.Inequality(target_environment, cassowary.LEQ, 1, cassowary.Strength.required),

          new cassowary.Inequality(target_status, cassowary.GEQ, 1, cassowary.Strength.required),
          new cassowary.Inequality(target_status, cassowary.LEQ, 1, cassowary.Strength.required),

          new cassowary.Inequality(target_capability, cassowary.GEQ, 1, cassowary.Strength.required),
          new cassowary.Inequality(target_capability, cassowary.LEQ, 1, cassowary.Strength.required),
          //new c.Inequality(v1, c.LEQ, 5, c.Strength.required)
        ];

        //var eq = new cassowary.Equation(x, new cassowary.Expression(y));
        solver.addConstraints(constraints);
        solver.resolve();
        console.log("TEST");
        console.log(target_environment.value);
        console.log(target_status.value);
        console.log(target_capability.value);

      }
    });
  };

  // normFile = (e) => {
  //   console.log('Upload event:', e);
  //   if (Array.isArray(e)) {
  //     return e;
  //   }
  //   return e && e.fileList;
  // };

  render() {
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 }
    };
    return (
      <Form {...formItemLayout} onSubmit={this.handleSubmit}>
        {/* <Form.Item label="Plain Text">
          <span className="ant-form-text">China</span>
        </Form.Item> */}

        {/* <Form.Item label="Select" hasFeedback>
          {getFieldDecorator('select', {
            rules: [{ required: true, message: 'Please select your country!' }],
          })(
            <Select placeholder="Please select a country">
              <Option value="china">China</Option>
              <Option value="usa">U.S.A</Option>
            </Select>,
          )}
        </Form.Item> */}

        <Form.Item label="Target environment">
          {getFieldDecorator("environment", {
            rules: [
              {
                required: true,
                message: "Please select target environment(s) for a deployment",
                type: "array"
              }
            ]
          })(
            <Select
              mode="multiple"
              placeholder="Please select target environment(s) for a deployment"
              style={{ width: "90%" }}
            >
              <Option value="production">Production</Option>
              <Option value="testing">Testing</Option>
              <Option value="safe-mode">Safe mode</Option>
            </Select>
          )}
          {getFieldDecorator(
            "environment-level",
            { initialValue: "required" },
            {
              rules: [
                {
                  required: true,
                  message:
                    "Please select target environment(s) for a deployment",
                  type: "string"
                }
              ]
            }
          )(
            <Select
              placeholder="Please select a requirement level"
              style={{ width: "10%" }}
            >
              <Option value="required">Required</Option>
              <Option value="strong">Strong</Option>
              <Option value="medium">Medium</Option>
              <Option value="weak">Weak</Option>
            </Select>
          )}
        </Form.Item>

        <Form.Item label="Target status">
          {getFieldDecorator("status", {
            rules: [
              {
                required: true,
                message: "Please select target status(es) for a deployment",
                type: "array"
              }
            ]
          })(
            <Select
              mode="multiple"
              placeholder="Please select target status(es) for a deployment"
              style={{ width: "90%" }}
            >
              <Option value="running">Running</Option>
              <Option value="failed">Failed</Option>
              <Option value="suspended">Suspended</Option>
            </Select>
          )}
          {getFieldDecorator(
            "status-level",
            {
              initialValue: "required"
            },
            {
              rules: [
                {
                  required: true,
                  message:
                    "Please select target environment(s) for a deployment",
                  type: "string"
                }
              ]
            }
          )(
            <Select
              placeholder="Please select a requirement level"
              style={{ width: "10%" }}
            >
              <Option value="required">Required</Option>
              <Option value="strong">Strong</Option>
              <Option value="medium">Medium</Option>
              <Option value="weak">Weak</Option>
            </Select>
          )}
        </Form.Item>

        <Form.Item label="Target capability">
          {getFieldDecorator("capability", {
            rules: [
              {
                required: true,
                message:
                  "Please select target device capability(ies) for a deployment",
                type: "array"
              }
            ]
          })(
            <Select
              mode="multiple"
              placeholder="Please select target device capability(ies) for a deployment"
              style={{ width: "90%" }}
            >
              <Option value="sensehat">SenseHat</Option>
              {/* <Option value="failed">Failed</Option>
              <Option value="suspended">Suspended</Option> */}
            </Select>
          )}

          {getFieldDecorator(
            "capability-level",
            { initialValue: "required" },
            {
              rules: [
                {
                  required: true,
                  message:
                    "Please select target environment(s) for a deployment",
                  type: "string"
                }
              ]
            }
          )(
            <Select
              placeholder="Please select a requirement level"
              style={{ width: "10%" }}
            >
              <Option value="required">Required</Option>
              <Option value="strong">Strong</Option>
              <Option value="medium">Medium</Option>
              <Option value="weak">Weak</Option>
            </Select>
          )}
        </Form.Item>

        <Form.Item label="Number of devices">
          {getFieldDecorator("number", {
            initialValue: 10,
            rules: [
              {
                required: true,
                message: "Please select the number of target devices",
                type: "number"
              }
            ]
          })(<InputNumber min={1} max={100} />)}
          {/* <span className="ant-form-text"> machines</span> */}
        </Form.Item>

        {/* <Form.Item label="Switch">
          {getFieldDecorator('switch', { valuePropName: 'checked' })(<Switch />)}
        </Form.Item> */}

        <Form.Item label="Deployment range">
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
            />
          )}
        </Form.Item>

        {/* <Form.Item label="Radio.Group">
          {getFieldDecorator('radio-group')(
            <Radio.Group>
              <Radio value="a">item 1</Radio>
              <Radio value="b">item 2</Radio>
              <Radio value="c">item 3</Radio>
            </Radio.Group>,
          )}
        </Form.Item> */}

        {/* <Form.Item label="Radio.Button">
          {getFieldDecorator('radio-button')(
            <Radio.Group>
              <Radio.Button value="a">item 1</Radio.Button>
              <Radio.Button value="b">item 2</Radio.Button>
              <Radio.Button value="c">item 3</Radio.Button>
            </Radio.Group>,
          )}
        </Form.Item> */}

        {/* <Form.Item label="Target environment">
          {getFieldDecorator('checkbox-group', {
            initialValue: ['A', 'B'],
          })(
            <Checkbox.Group style={{ width: '100%' }}>
              <Row>
                <Col span={8}>
                  <Checkbox value="A">A</Checkbox>
                </Col>
                <Col span={8}>
                  <Checkbox disabled value="B">
                    B
                  </Checkbox>
                </Col>
                <Col span={8}>
                  <Checkbox value="C">C</Checkbox>
                </Col>
                <Col span={8}>
                  <Checkbox value="D">D</Checkbox>
                </Col>
                <Col span={8}>
                  <Checkbox value="E">E</Checkbox>
                </Col>
              </Row>
            </Checkbox.Group>,
          )}
        </Form.Item> */}

        {/* <Form.Item label="Target capabilities">
          {getFieldDecorator('checkbox-group', {
            initialValue: ['A', 'B'],
          })(
            <Checkbox.Group style={{ width: '100%' }}>
              <Row>
                <Col span={8}>
                  <Checkbox value="A">A</Checkbox>
                </Col>
                <Col span={8}>
                  <Checkbox disabled value="B">
                    B
                  </Checkbox>
                </Col>
                <Col span={8}>
                  <Checkbox value="C">C</Checkbox>
                </Col>
                <Col span={8}>
                  <Checkbox value="D">D</Checkbox>
                </Col>
                <Col span={8}>
                  <Checkbox value="E">E</Checkbox>
                </Col>
              </Row>
            </Checkbox.Group>,
          )}
        </Form.Item> */}

        {/* <Form.Item label="Target status">
          {getFieldDecorator('checkbox-group', {
            initialValue: ['A', 'B'],
          })(
            <Checkbox.Group style={{ width: '100%' }}>
              <Row>
                <Col span={8}>
                  <Checkbox value="A">A</Checkbox>
                </Col>
                <Col span={8}>
                  <Checkbox disabled value="B">
                    B
                  </Checkbox>
                </Col>
                <Col span={8}>
                  <Checkbox value="C">C</Checkbox>
                </Col>
                <Col span={8}>
                  <Checkbox value="D">D</Checkbox>
                </Col>
                <Col span={8}>
                  <Checkbox value="E">E</Checkbox>
                </Col>
              </Row>
            </Checkbox.Group>,
          )}
        </Form.Item> */}

        {/* <Form.Item label="Rate">
          {getFieldDecorator('rate', {
            initialValue: 3.5,
          })(<Rate />)}
        </Form.Item> */}

        {/* <Form.Item label="Upload" extra="longgggggggggggggggggggggggggggggggggg">
          {getFieldDecorator('upload', {
            valuePropName: 'fileList',
            getValueFromEvent: this.normFile,
          })(
            <Upload name="logo" action="/upload.do" listType="picture">
              <Button>
                <Icon type="upload" /> Click to upload
              </Button>
            </Upload>,
          )}
        </Form.Item> */}

        {/* <Form.Item label="Dragger">
          {getFieldDecorator('dragger', {
            valuePropName: 'fileList',
            getValueFromEvent: this.normFile,
          })(
            <Upload.Dragger name="files" action="/upload.do">
              <p className="ant-upload-drag-icon">
                <Icon type="inbox" />
              </p>
              <p className="ant-upload-text">Click or drag file to this area to upload</p>
              <p className="ant-upload-hint">Support for a single or bulk upload.</p>
            </Upload.Dragger>,
          )}
        </Form.Item> */}

        <Form.Item wrapperCol={{ span: 12, offset: 6 }}>
          <Button type="primary" htmlType="submit">
            Diversify
          </Button>
        </Form.Item>
      </Form>
    );
  }

  // render() {

  //   return (
  //     <Layout>
  //     <Content>
  //       <Row>
  //         <Col span={24}>
  //           <Table
  //             //bordered
  //             rowKey={record => record.id}
  //             size='small'
  //             dataSource={this.props.devices}
  //             columns={this.columns}
  //             //expandRowByClick={true}
  //             expandedRowRender={record =>
  //               <span>
  //                 <ReactJson src={record} enableClipboard={false} />
  //                 <Table columns={this.nestedColumns} dataSource={this.props.activeDeployments[record.id] ? Object.values(this.props.activeDeployments[record.id]) : []} pagination={false}/>
  //                 </span>
  //               }
  //             pagination={{ pageSize: 50 }}
  //           />
  //         </Col>
  //       </Row>
  //     </Content>
  //     </Layout>
  //   );
  // }

  componentDidMount() {
    //add if needed    
  }

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
