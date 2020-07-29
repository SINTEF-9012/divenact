import React, { Component } from "react";
import axios from "axios";
import { Button, Col, Row, Steps, message, Badge, Tag } from "antd";
import { VariantStep } from "./VariantStep";
import { DeviceStep } from "./DeviceStep";
import { JsonYamlStep } from "./JsonYamlStep";
import { SMTStep } from "./SMTStep";
import { ApproveStep } from "./ApproveStep";
import { DiversificationContext } from "./DiversificationContext";

const { Step } = Steps;
const colors = [
  "blue",
  "red",
  "green",
  "blue",
  "red",
  "green",
  "blue",
  "red",
  "green",
];

export class DiversificationArea extends Component {
  constructor(props) {
    super(props);
    this.variantColumns = [
      {
        title: "Variant ID",
        dataIndex: "id",
      },
      {
        title: "Template",
        dataIndex: "template",
        render: (text, record) => (
          <Button type="link" onClick={() => this.props.callbackTabChange("1")}>
            {record.template}
          </Button>
        ),
      },
      {
        title: "Deployment parameters",
        dataIndex: "params",
        render: (text, record) =>
          record.dep_params === null ? (
            <Button
              type="link"
              onClick={() => message.success("Deployment parameters")}
            >
              View
            </Button>
          ) : (
            ""
          ),
      },
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
          ),
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
        width: 600,
      },
    ];
    this.nestedDeviceColumns = [
      {
        title: "Active deployments",
        dataIndex: "id",
        render: (text, record) => (
          <Button
            type="link"
            icon="deployment-unit"
            onClick={() => this.props.callbackTabChange("3")}
          >
            {record}
          </Button>
        ),
      },
    ];
    this.state = {
      //selected_variants: {},
      //selected_devices: {},
      deployment_list: { deployments: {} },
      device_list: { devices: {} },
      z3_solution: "",
      //selectedFile: null,
      //uploading: false,
      json_model: require("../resources/sample_input.json"),
      selected_variant_rowkeys: [],
      selected_device_rowkeys: [],
      setSelectedVariantRowKeys: this.setSelectedVariantRowKeys,
      //setSelectedVariants: this.setSelectedVariants,
      setDeploymentList: this.setDeploymentList,
      setSelectedDeviceRowKeys: this.setSelectedDeviceRowKeys,
      //setSelectedDevices: this.setSelectedDevices,
      setDeviceList: this.setDeviceList,
      setZ3Solution: this.setZ3Solution,
      current_step: 2,
      result: "",
      yaml_model: "",
    };
  }

  ///////////////////////////////
  //  Setters for the context  //
  ///////////////////////////////

  setSelectedVariantRowKeys = (value) => {
    console.log("setSelectedVariantRowKeys", value);
    this.setState({ selected_variant_rowkeys: value });
  };

  setDeploymentList = (value) => {
    console.log("setDeploymentList", value);
    //var deployments = this.state.selected_variants;
    //this.setState({ deployment_list: { deployments: deployments } });
    this.setState({ deployment_list: value });
  };

  setSelectedDeviceRowKeys = (value) => {
    console.log("setSelectedDeviceRowKeys", value);
    this.setState({ selected_device_rowkeys: value });
  };

  setDeviceList = (value) => {
    console.log("setDeviceList", value);
    this.setState({ device_list: value });
  };

  setZ3Solution = (value) => {
    console.log("setZ3Solution", value);
    this.setState({ z3_solution: value });
  };

  handleYamlChange = (model) => {
    console.log(model);
    this.setState({ yaml_model: model });
  };

  ///////////////////////////////
  ///////////////////////////////

  next = () => {
    switch (this.state.current_step) {
      case 0: //variants and parameters
        if (
          Array.isArray(this.state.selected_variant_rowkeys) &&
          this.state.selected_variant_rowkeys.length > 0
        ) {
          const current_step = this.state.current_step + 1;
          this.setState({ current_step });
        } else {
          message.warning("Please select variants!");
        }
        break;
      case 1: //devices
        //check if no of devices >= no of deployments
        if (
          this.state.selected_device_rowkeys.length >
          this.state.selected_device_rowkeys.length
        ) {
          message.warning(
            "Number of targeted devices cannot be less than the number of variants to be deployed!"
          );
        } else {
          const current_step = this.state.current_step + 1;
          this.setState({ current_step });
        }
        break;
      case 2: //design SMT logic
        //TODO
        if (true) { // check if SMT editor is not empty
          const current_step = this.state.current_step + 1;
          this.setState({ current_step });
        }
        break;
      case 3: //verify and approve
        //TODO
        this.solve();
        const current_step = this.state.current_step + 1;
        this.setState({ current_step });
        break;
      case 4: //view results
        //TODO deploy selected variant to selected devices
        //console.log(this.state.selectedDeviceRowKeys.length);
        message.success("Deployment complete!");
        //this.handleSubmit;
        break;
      default:
    }
  };

  prev = () => {
    const current_step = this.state.current_step - 1;
    this.setState({ current_step });
  };

  solve = () => {
    //const { selectedFile } = this.state;
    console.log(this.state.yaml_model);
    console.log(
      "Solving with: ",
      this.state.deployment_list,
      this.state.device_list
    );
    const formData = new FormData();
    //formData.append("files", selectedFile, "script.py");
    var json = JSON.stringify(
      Object.assign(this.state.deployment_list, this.state.device_list)
    );
    console.log("json", json);
    formData.append("json", json);
    formData.append("yaml", this.state.yaml_model);

    console.log(formData);

    // this.setState({
    //   uploading: true
    // });

    axios
      .post("/api/z3", formData)
      .then((res) => {
        console.log("res.data", res.data);
        this.setState({ result: res.data });
        this.setState({ z3_solution: res.data });
      })
      .catch((err) => {
        console.log("err", err);
      });

    // this.setState({
    //   uploading: false
    // });
  };

  render() {
    const { current_step } = this.state;

    const steps = [
      {
        title: "Variants",
        status: "process",
        content: (
          <DiversificationContext.Provider value={this.state}>
            <VariantStep
              wrappedComponentRef={this.saveFormRef}
              callbackTabChange={this.props.callbackTabChange}
            />
          </DiversificationContext.Provider>
        ),
      },
      {
        title: "Devices",
        status: "process",
        content: (
          <DeviceStep callbackTabChange={this.props.callbackTabChange} />
        ),
      },
      {
        title: "SMT",
        status: "process",
        content: <SMTStep callbackTabChange={this.props.callbackTabChange} />,
      },
      {
        title: "JSON",
        status: "process",
        content: (
          <DiversificationContext.Provider value={this.state}>
            <JsonYamlStep
              json_deployments={this.state.selected_deployments}
              json_devices={this.state.selected_devices}
              handleYamlChange={this.handleYamlChange}
            />
          </DiversificationContext.Provider>
        ),
      },
      {
        title: "Z3 results",
        status: "process",
        content: <ApproveStep result={this.state.result} />,
      },
    ];

    return (
      <DiversificationContext.Provider value={this.state}>
        <div>
          <Row type="flex" justify="center" style={{ marginBottom: 20 }}>
            <Col span={22}>
              <Steps
                current={current_step}
                size="small"
                //onChange={this.next}
              >
                {steps.map((item) => (
                  <Step key={item.title} title={item.title} />
                ))}
              </Steps>
            </Col>
          </Row>
          <Row type="flex" justify="center">
            <Col span={22}>
              <div className="steps-content">{steps[current_step].content}</div>
              <div className="steps-action" align="center">
                {current_step > 0 && (
                  <Button onClick={() => this.prev()}>Previous</Button>
                )}
                {current_step < 4 && (
                  <Button
                    style={{ marginLeft: 8 }}
                    type="primary"
                    onClick={() => this.next()}
                  >
                    Next
                  </Button>
                )}
                {current_step === 4 && (
                  <Button
                    style={{ marginLeft: 8 }}
                    type="primary"
                    onClick={() => this.next()}
                  >
                    Approve ànd Deploy
                  </Button>
                )}
              </div>
            </Col>
          </Row>
        </div>
      </DiversificationContext.Provider>
    );
  }

  componentDidMount() {
    //TODO
    //this.setState({ variants: this.props.variants });
    //console.log("TESTING", this.props.variants);
  }
}
