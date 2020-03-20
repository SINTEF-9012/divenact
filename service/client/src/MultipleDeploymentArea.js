import React, { Component } from "react";
import axios from "axios";
import ReactJson from "react-json-view";
import DeploymentForm from "./DeploymentForm";
import MainForm from "./MainForm";
import {
  Tabs,
  Icon,
  Collapse,
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
import { solve } from "./solvers/WeightedProductModelSolver";
import { VariantArea } from "./ModelContentArea";

const { Panel } = Collapse;
const { Option } = Select;
const { Step } = Steps;
const { TabPane } = Tabs;

const colors = ["blue", "red", "green"];

function callback(key) {
  console.log(key);
}

const text = `
  A dog is a type of domesticated animal.
  Known for its loyalty and faithfulness,
  it can be found as a welcome guest in many households across the world.
`;

const genExtra = () => (
  <Icon
    type="SettingOutlined "
    onClick={event => {
      // If you don't want click extra trigger collapse, you can prevent this:
      event.stopPropagation();
    }}
  />
);

class MultipleDeploymentArea extends Component {
  constructor(props) {
    super(props);
    this.newTabIndex = 0;
    this.variantColumns = [
      {
        title: "Variant ID",
        dataIndex: "id",
        width: 500
      }
    ];
    this.nestedDeviceColumns = [
      {
        title: "Matching devices",
        dataIndex: "id",
        render: (text, record) => (
          <Button
            type="link"
            icon="branches"
            onClick={() => this.props.callbackTabChange("2")}
          >
            {record.id}
          </Button>
        )
      }
    ];
    const panes = [
      {
        title: "Deployment 1",
        content: (
          <MainForm
            variants={this.props.variants}
            devices={this.props.devices}
            tags={this.props.deviceTags}
            form={this.props.form}
            deployments={this.props.deployments}
            activeDeployments={this.props.activeDeployments}
            appliedDevices={this.props.appliedDevices}
            deviceTags={this.props.deviceTags}
            callbackTabChange={this.props.callbackTabChange}
          />
        ),
        key: "1"
      }
    ];
    this.state = {
      //add if needed
      matchingDevices: [],
      devices: this.props.devices,
      currentStep: 0,
      selectedVariantRowKeys: [],
      expandIconPosition: "left",
      activeKey: panes[0].key,
      panes
    };
  }

  next = () => {
    //const { selectedVariantRowKeys } = this.state;
    //const { matchingDevices } = this.state;
    switch (this.state.currentStep) {
      case 0:
        const currentStep = this.state.currentStep + 1;
        this.setState({ currentStep });
        break;
      case 1:
        break;
      default:
    }
  };

  prev = () => {
    const currentStep = this.state.currentStep - 1;
    this.setState({ currentStep });
  };

  onChange = activeKey => {
    this.setState({ activeKey });
  };

  onEdit = (targetKey, action) => {
    this[action](targetKey);
  };

  add = () => {
    const { panes } = this.state;
    const activeKey = `newTab${this.newTabIndex++}`;
    panes.push({
      title: "Deployment " + (panes.length + 1),
      content: (
        <MainForm
          variants={this.props.variants}
          devices={this.props.devices}
          tags={this.props.deviceTags}
          form={this.props.form}
          deployments={this.props.deployments}
          activeDeployments={this.props.activeDeployments}
          appliedDevices={this.props.appliedDevices}
          deviceTags={this.props.deviceTags}
          callbackTabChange={this.props.callbackTabChange}
        />
      ),
      key: activeKey
    });
    this.setState({ panes, activeKey });
  };

  remove = targetKey => {
    let { activeKey } = this.state;
    let lastIndex;
    this.state.panes.forEach((pane, i) => {
      if (pane.key === targetKey) {
        lastIndex = i - 1;
      }
    });
    const panes = this.state.panes.filter(pane => pane.key !== targetKey);
    if (panes.length && activeKey === targetKey) {
      if (lastIndex >= 0) {
        activeKey = panes[lastIndex].key;
      } else {
        activeKey = panes[0].key;
      }
    }
    this.setState({ panes, activeKey });
  };

  render() {
    const { currentStep } = this.state;
    const steps = [
      {
        title: "Configure multiple deployments",
        status: "process",
        content: (
          <Tabs
            onChange={this.onChange}
            activeKey={this.state.activeKey}
            type="editable-card"
            onEdit={this.onEdit}
          >
            {this.state.panes.map(pane => (
              <TabPane
                tab={
                  <span>
                    <Badge status="processing" />
                    {pane.title}
                  </span>
                }
                key={pane.key}
                closable={pane.closable}
              >
                {pane.content}
              </TabPane>
            ))}
          </Tabs>
        )
      },
      {
        title: "Confirm diversification",
        status: "process",
        content: (
          <Table
            //bordered
            //rowSelection={deviceRowSelection}
            rowKey={record => record.id}
            size="small"
            dataSource={this.props.variants}
            columns={this.variantColumns}
            expandedRowRender={record => (
              <span>
                <Table
                  columns={this.nestedDeviceColumns}
                  dataSource={this.props.devices.slice(2, 4)} //TODO ALARM!!!
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
          <Col span={22}>
            <Steps
              current={currentStep}
              type="navigation"
              onChange={currentStep == 0 ? this.next : this.prev}
            >
              {steps.map(item => (
                <Step key={item.title} title={item.title} />
              ))}
            </Steps>
          </Col>
        </Row>
        <Row type="flex" justify="center">
          <Col span={22}>
            <div>{steps[currentStep].content}</div>
          </Col>
        </Row>
      </div>
    );
  }

  // const { expandIconPosition } = this.state;
  // return (
  //   <div>
  //     <Collapse
  //       defaultActiveKey={["1"]}
  //       onChange={callback}
  //       expandIconPosition={expandIconPosition}
  //     >
  //       <Panel header="Deployment 1" key="1" extra={genExtra()}>
  //       <MainForm
  //     variants={this.props.variants}
  //     devices={this.props.devices}
  //     tags={this.props.deviceTags}
  //     form={this.props.form}
  //     deployments={this.props.deployments}
  //     activeDeployments={this.props.activeDeployments}
  //     appliedDevices={this.props.appliedDevices}
  //     deviceTags={this.props.deviceTags}
  //     callbackTabChange={this.props.callbackTabChange}
  //   />
  //       </Panel>
  //       <Panel header="Deployment 1" key="2" extra={genExtra()}>
  //         <div>{text}</div>
  //       </Panel>
  //       <Panel header="Deployment 1" key="3" extra={genExtra()}>
  //         <div>{text}</div>
  //       </Panel>
  //     </Collapse>
  //   </div>
  // );
  //}

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

const MultipleDeploymentForm = Form.create({})(MultipleDeploymentArea);
export default MultipleDeploymentForm;
