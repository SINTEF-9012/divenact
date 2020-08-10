import React, { Component } from "react";
import axios from "axios";
import { Button, Col, Row, Steps, message, Badge, Tag } from "antd";
import { VariantStep } from "./VariantStep";
import { DeviceStep } from "./DeviceStep";
import { JsonYamlStep } from "./JsonYamlStep";
import { SMTStep } from "./SMTStep";
import { ApproveStep } from "./ApproveStep";
import { DiversificationContext } from "./DiversificationContext";
import { GlobalContext } from "../GlobalContext";
import DefaultSMT from "../resources/default_smt";

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
  static contextType = GlobalContext;

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
          <Button
            type="link"
            onClick={() => this.context.callbackTabChange("1")}
          >
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
            onClick={() => this.context.callbackTabChange("3")}
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
      handleTabChange: this.handleTabChange, //FIXME: how to pass global context values into diversification context?
      setSelectedVariantRowKeys: this.setSelectedVariantRowKeys,
      //setSelectedVariants: this.setSelectedVariants,
      setDeploymentList: this.setDeploymentList,
      setSelectedDeviceRowKeys: this.setSelectedDeviceRowKeys,
      //setSelectedDevices: this.setSelectedDevices,
      setDeviceList: this.setDeviceList,
      setZ3Output: this.setZ3Output,
      setJsonInput: this.setJsonInput,
      setYamlInput: this.setYamlInput,
      setSmtInput: this.setSmtInput,
      json_input: "",
      yaml_input: "",
      smt_input: DefaultSMT,
      current_step: 2,
      result: "",      
    };
  }

  ///////////////////////////////
  //  Setters for the context  //
  ///////////////////////////////

  /**
   * Sets selected deployment records in the table.
   *
   * @param value selected deployment records in the table.
   */
  setSelectedVariantRowKeys = (value) => {
    console.log("setSelectedVariantRowKeys", value);
    this.setState({ selected_variant_rowkeys: value });
  };

  /**
   * Sets deployment list.
   *
   * @param value list of deployments to be assigned.
   */
  setDeploymentList = (value) => {
    console.log("setDeploymentList", value);
    //var deployments = this.state.selected_variants;
    //this.setState({ deployment_list: { deployments: deployments } });
    this.setState({ deployment_list: value });
  };

  /**
   * Sets selected device records in the table.
   *
   * @param value selected device records in the table.
   */
  setSelectedDeviceRowKeys = (value) => {
    console.log("setSelectedDeviceRowKeys", value);
    this.setState({ selected_device_rowkeys: value });
  };

  /**
   * Sets device list.
   *
   * @param value list of target devices.
   */
  setDeviceList = (value) => {
    console.log("setDeviceList", value);
    this.setState({ device_list: value });
  };

  /**
   * Sets input model as JSON to be sent to the solver
   *
   * @param {string} value output string containing rezults from the Z3 solver in JSON.
   */
  setZ3Output = (value) => {
    console.log("Z3 Solution", value);
    this.setState({ z3_solution: value });
  };

  /**
   * Sets input model as YAML
   *
   * @param {string} value input string containing YAML model.
   */
  setYamlInput = (value) => {
    console.log(value);
    this.setState({ yaml_input: value });
  };

  /**
   * Sets input model as JSON
   *
   * @param {string} value input string containing JSON model.
   */
  setJsonInput = (value) => {
    console.log(value);
    this.setState({ json_input: value });
  };

  /**
   * Sets SMT logic
   *
   * @param {string} value input string containing SMT logic in the form of a python script.
   */
  setSmtInput = (value) => {
    console.log(value);
    this.setState({ smt_input: value });
  };

  /**
   * Copies function from Global Context to the local state and then to Diversification Context.
   * 
   * @param {string} value number of the tab to make active.
   */
  handleTabChange = (value) => {
    this.context.handleTabChange(value);
  };

  ///////////////////////////////
  ///////////////////////////////

  /**
   * Goes to the next tab.
   */
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
      case 2: //verify and approve
        //TODO
        this.solve();
        const current_step = this.state.current_step + 1;
        this.setState({ current_step });
        break;
      case 3: //design SMT logic
        //TODO
        if (true) {
          // TODO: check that SMT editor is not empty
          const current_step = this.state.current_step + 1;
          this.setState({ current_step });
        }
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

  /**
   * Goes to previous tab.
   */
  prev = () => {
    const current_step = this.state.current_step - 1;
    this.setState({ current_step });
  };

  solve = () => {
    //const { selectedFile } = this.state;
    console.log("YAML: ", this.state.yaml_input);
    console.log("JSON: ", this.state.json_input);
    console.log("SMT: ", this.state.smt_input);
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
    this.setState({ json_input: json });

    console.log("json", json);
    console.log("yaml", this.state.yaml_input);
    console.log("smt", this.state.smt_input);

    formData.append("json", json);
    formData.append("yaml", this.state.yaml_input);
    formData.append("smt", this.state.smt_input);

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

  /**
   * Pushed Z3 results for deployment to Azure IoT.
   */
  deploy = () => {
    //TODO: this is where we pass the solution to Azure. 
    //Decide on the format and modify the server side TypeScript accordingly.

  };

  /**
   * Renders the page.
   */
  render = () => {
    const { current_step } = this.state;

    const steps = [
      {
        title: "Variants",
        status: "process",
        content: (
          <DiversificationContext.Provider value={this.state}>
            <VariantStep
              wrappedComponentRef={this.saveFormRef}              
            />
          </DiversificationContext.Provider>
        ),
      },
      {
        title: "Devices",
        status: "process",
        content: <DeviceStep />,
      },
      {
        title: "JSON/YAML",
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
        title: "SMT",
        status: "process",
        content: <SMTStep />,
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
                    Approve and Deploy
                  </Button>
                )}
              </div>
            </Col>
          </Row>
        </div>
      </DiversificationContext.Provider>
    );
  };

  /**
   * Contains some initialisation code, if needed.
   */
  componentDidMount() {
    //TODO:
  }
}
