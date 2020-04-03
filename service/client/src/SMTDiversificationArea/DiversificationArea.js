import React, { Component } from "react";
import axios from "axios";
import { Button, Col, Row, Steps, message, Badge, Tag } from "antd";
import { VariantStep } from "./VariantStep";
import { DeviceStep } from "./DeviceStep";
import { JsonYamlStep } from "./JsonYamlStep";
import { Z3Step } from "./Z3Step";

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
  "green"
];

export class DiversificationArea extends Component {
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
        )
      }
    ];
    this.state = {
      result: {},
      devices: this.props.devices,
      variants: this.props.variants,
      selected_deployments: {},
      selected_devices: {},
      //selectedFile: null,
      //uploading: false,
      json_model: require("../resources/sample_input.json"),
      selected_variant_rowkeys: [],
      selected_device_rowkeys: [],
      current_step: 0
    };
  }

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
      case 3: //view results
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
    console.log(
      "Solving with: ",
      this.state.selected_deployments,
      this.state.selected_devices
    );
    const formData = new FormData();
    //formData.append("files", selectedFile, "script.py");
    var json = JSON.stringify(
      Object.assign(
        this.state.selected_deployments,
        this.state.selected_devices
      )
    );
    console.log("json", json);
    formData.append("json", json);

    // this.setState({
    //   uploading: true
    // });

    axios
      .post("/api/z3", formData)
      .then(res => {
        console.log("res.data", res.data);
        this.setState({ result: res.data });
      })
      .catch(err => {
        console.log("err", err);
      });

    // this.setState({
    //   uploading: false
    // });
  };

  // onVariantSelectChange = value => {
  //   console.log("selectedVariantRowKeys changed: ", value);
  //   this.setState({ selectedVariantRowKeys: value });
  // };

  // onVariantSelect = (record, selected, selectedRows, nativeEvent) => {
  //   console.log(
  //     "Selected variant: ",
  //     record,
  //     selected,
  //     selectedRows,
  //     nativeEvent
  //   );
  //   this.setState({
  //     visible: selected
  //   });
  //   console.log("selected keys before", this.state.selectedVariantRowKeys);
  // };

  // onDeviceSelectChange = value => {
  //   console.log("selectedDeviceRowKeys changed: ", value);
  //   this.setState({ selectedDeviceRowKeys: value });
  // };

  // handleEdit = json => {
  //   this.setState({ json_model: json.updated_src });
  //   console.log(this.state.json_model);
  // };

  // handleUpload = () => {
  //   //const { selectedFile } = this.state;
  //   const formData = new FormData();
  //   //formData.append("files", selectedFile, "script.py");
  //   formData.append("json", JSON.stringify(this.state.json_model));

  //   this.setState({
  //     uploading: true
  //   });

  //   axios
  //     .post("/api/z3", formData)
  //     .then(res => {
  //       console.log("res.data", res.data);
  //       this.setState({ result: res.data });
  //     })
  //     .catch(err => {
  //       console.log("err", err);
  //     });

  //   this.setState({
  //     uploading: false
  //   });
  // };

  // handleOk = value => {
  //   this.setState({
  //     visible: false
  //   });
  //   //TODO
  //   console.log();
  // };

  // handleCancel = () => {
  //   console.log("Clicked cancel button");
  //   this.setState({
  //     visible: false
  //   });
  //   //TODO deselect row
  //   this.state.selectedVariantRowKeys.pop();
  //   console.log("selected keys", this.state.selectedVariantRowKeys);
  // };

  // handleSubmit = e => {
  //   e.preventDefault();
  //   //TODO deploy selected variant to selected devices
  //   const { form } = this.formRef.props;
  //   form.validateFields((err, values) => {
  //     if (!err) {
  //       //values = this.removeDisabledFields(values);
  //       console.log("Form submited", values);
  //       //TODO return values to the parent
  //       this.setState({
  //         visible: false
  //       });
  //     } else {
  //       message.warning("Please specify the deployment parameters!");
  //     }
  //   });
  // };

  saveFormRef = formRef => {
    this.formRef = formRef;
  };

  handleVariantSelect = value => {
    console.log("Received variants: ", value);
    this.setState({ selected_variant_rowkeys: value });
  };

  handleDeviceSelect = value => {
    console.log("Received devices: ", value);
    this.setState({ selected_device_rowkeys: value });
  };

  handleDeploymentSelect = values => {
    console.log("Selected deployments: ", values.deployments);
    this.setState({ selected_deployments: values });

    //TODO update the list of variants with deployment parameters and refresh the table
    // var variants = this.props.variants;
    // for (const key in values.deployments) {
    //   //devices[entry].dep_params = values.deployments[entry];
    //   console.log("variants", variants);
    //   console.log("value", values.deployments[key]);

    //   var foundIndex = variants.findIndex(entry => entry.id == key);
    //   variants[foundIndex].dep_params = values.deployments[key];
    //   this.props.variants[foundIndex].dep_params = values.deployments[key];
    //   console.log("updated", variants[foundIndex]);
    // }
    // this.setState({ variants: variants });
  };

  handleTargetDeviceSelect = value => {
    console.log("Selected devices!!!: ", value);
    this.setState({ selected_devices: value });
  };

  render() {
    const { current_step } = this.state;

    const steps = [
      {
        title: "Variants",
        status: "process",
        content: (
          <VariantStep
            variants={this.props.variants}
            selectedVariantRowKeys={this.state.selected_variant_rowkeys}
            callbackVariantSelect={this.handleVariantSelect}
            callbackDeploymentSelect={this.handleDeploymentSelect}
          />
        )
      },
      {
        title: "Devices",
        status: "process",
        content: (
          <DeviceStep
            devices={this.props.devices}
            deviceTags={this.props.deviceTags}
            activeDeployments={this.props.activeDeployments}
            selectedDeviceRowKeys={this.state.selected_device_rowkeys}
            callbackDeviceSelect={this.handleDeviceSelect}
            callbackTargetDeviceSelect={this.handleTargetDeviceSelect}
          />
        )
      },
      {
        title: "JSON",
        status: "process",
        content: (
          <JsonYamlStep
            json_deployments={this.state.selected_deployments}
            json_devices={this.state.selected_devices}
          />
        )
      },
      {
        title: "Z3 results",
        status: "process",
        content: <Z3Step result={this.state.result} />
      }
    ];

    return (
      <div>
        <Row type="flex" justify="center" style={{ marginBottom: 20 }}>
          <Col span={22}>
            <Steps
              current={current_step}
              size="small"
              //onChange={this.next}
            >
              {steps.map(item => (
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
              {current_step < 3 && (
                <Button
                  style={{ marginLeft: 8 }}
                  type="primary"
                  onClick={() => this.next()}
                >
                  Next
                </Button>
              )}
              {current_step === 3 && (
                <Button
                  style={{ marginLeft: 8 }}
                  type="primary"
                  onClick={() => this.next()}
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
    //TODO
  }
}
