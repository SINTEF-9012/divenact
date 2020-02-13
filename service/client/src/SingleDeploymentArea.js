import React, { Component } from "react";
import axios from "axios";
import ReactJson from "react-json-view";
import DeploymentForm from "./DeploymentForm";
import {
  Layout,
  Steps,
  Table,
  Badge,
  Tag,
  Form,
  Select,
  DatePicker,
  Button,
  Row,
  Col,
  message
} from "antd";
import { solve } from "./WeightedProductModelSolver";
import { VariantArea } from "./ModelContentArea";

const { Step } = Steps;
const colors = ["blue", "red", "green"];

class SingleDeploymentArea extends Component {
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
        render: (text, record) =>
          this.props.deviceTags[record.id].status === "failed" ? (
            <span>
              <Badge status="error" />
              {record.id}
            </span>
          ) : (
            <span>
              <Badge status="success" />
              {record.id}
            </span>
          )
      },
      {
        title: "Tags",
        dataIndex: "tags",
        render: (text, record) =>
          this.props.deviceTags[record.id] &&
          Object.keys(this.props.deviceTags[record.id]).map((key, i) => (
            <Tag color={colors[i]}>
              {key}: {this.props.deviceTags[record.id][key]}
            </Tag>
          )),
        width: 600
      }
    ];
    this.state = {
      //add if needed
      matchingDevices: [],
      devices: this.props.devices,
      currentStep: 0,
      selectedVariantRowKeys: []
    };
  }

  next = () => {
    if (this.state.currentStep == 1) {
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
    }

    const currentStep = this.state.currentStep + 1;
    this.setState({ currentStep });
  }

  prev = () => {
    const currentStep = this.state.currentStep - 1;
    this.setState({ currentStep });
  }

  onVariantSelectChange = selectedVariantRowKeys => {
    console.log('selectedVariantRowKeys changed: ', selectedVariantRowKeys);
    this.setState({ selectedVariantRowKeys });
  };  

  render() {
    //const { getFieldDecorator } = this.props.form;
    //const { myValidateHelp, myValidateStatus } = this.state;
    const { currentStep } = this.state;
    const formItemLayout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 12 }
    };    
    const { selectedVariantRowKeys } = this.state;
    const variantRowSelection = {
      selectedVariantRowKeys,
      onChange: this.onVariantSelectChange,
      type: 'radio'
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
          <DeploymentForm devices={this.props.devices} form={this.props.form} />
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
            //expandRowByClick={true}
            expandedRowRender={record => (
              <span>
                <ReactJson src={record} enableClipboard={false} />
                <Table
                  columns={this.nestedColumns}
                  dataSource={
                    this.props.activeDeployments[record.id]
                      ? Object.values(this.props.activeDeployments[record.id])
                      : []
                  }
                  pagination={false}
                />
              </span>
            )}
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
    );
  }

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

const MainForm = Form.create({})(SingleDeploymentArea);
export default MainForm;
