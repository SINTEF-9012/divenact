import React, { Component } from "react";
import axios from "axios";
import ReactJson from "react-json-view";
import {
  Button,
  Col,
  Row,
  Modal,
  Typography,
  Steps,
  message,
  Table,
  Badge,
  Tag
} from "antd";
import SMTForm from "./SMTForm";

const { Title } = Typography;
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

export class Z3Area extends Component {
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
      //   {
      //     title: "Device ID",
      //     dataIndex: "id",
      //     width: 200,
      //     render: (text, record) => <span>{record.id}</span>
      //   }
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
      //selectedFile: null,
      //uploading: false,
      json_model: require("./resources/sample_input.json"),
      ModalText: "Specify deployment paramaters",
      currentStep: 0,
      selectedVariantRowKeys: [],
      selectedDeviceRowKeys: [],
      visible: false,
      confirmLoading: false,
      current_step: 0
    };
  }

  next = () => {
    //const { selectedVariantRowKeys } = this.state;
    //const { matchingDevices } = this.state;
    switch (this.state.current_step) {
      case 0: //variants and parameters
        if (
          Array.isArray(this.state.selectedVariantRowKeys) &&
          this.state.selectedVariantRowKeys.length > 0
        ) {
          const current_step = this.state.current_step + 1;
          this.setState({ current_step });
        } else {
          message.warning("Please select variants!");
        }
        break;
      case 1: //devices
        this.props.form.validateFields((err, values) => {
          if (!err) {
            values = this.removeDisabledFields(values);
            //let devices = solveDummy(values, this.props.devices);
            //this.setState({ matchingDevices: devices });

            //let selected_devices = [];
            //devices.forEach(device => selected_devices.push(device.id));
            //this.setState({ selectedDeviceRowKeys: selected_devices });

            const current_step = this.state.current_step + 1;
            this.setState({ current_step });
          } else {
            message.warning("Please specify the deployment parameters!");
          }
        });

        break;
      case 2: //verify and approve
        //TODO
        break;
      case 3: //view results
        if (this.state.selectedDeviceRowKeys.length > 0) {
          //TODO deploy selected variant to selected devices
          //console.log(this.state.selectedDeviceRowKeys.length);
          message.success("Deployment complete!");
          //this.handleSubmit;
        } else {
          message.warning("Please select at least one matching device!");
        }
        break;
      default:
    }
  };

  prev = () => {
    const current_step = this.state.current_step - 1;
    this.setState({ current_step });
  };

  onVariantSelectChange = value => {
    console.log("selectedVariantRowKeys changed: ", value);
    this.setState({ selectedVariantRowKeys: value });
  };

  onVariantSelect = (record, selected, selectedRows, nativeEvent) => {
    console.log(
      "Selected variant: ",
      record,
      selected,
      selectedRows,
      nativeEvent
    );
    //record.dep_params = "test";
    //console.log("Selected variant: ", record);
    this.setState({
      visible: selected
    });
    console.log("selected keys before", this.state.selectedVariantRowKeys);
  };

  onDeviceSelectChange = value => {
    console.log("selectedDeviceRowKeys changed: ", value);
    this.setState({ selectedDeviceRowKeys: value });
  };

  handleEdit = json => {
    this.setState({ json_model: json.updated_src });
    console.log(this.state.json_model);
  };

  handleUpload = () => {
    //const { selectedFile } = this.state;
    const formData = new FormData();
    //formData.append("files", selectedFile, "script.py");
    formData.append("json", JSON.stringify(this.state.json_model));

    this.setState({
      uploading: true
    });

    axios
      .post("/api/z3", formData)
      .then(res => {
        console.log("res.data", res.data);
        this.setState({ result: res.data });
      })
      .catch(err => {
        console.log("err", err);
      });

    this.setState({
      uploading: false
    });
  };

  handleOk = (value) => {
    this.setState({
      visible: false,
    });
    //TODO 
    console.log();
  };

  handleCancel = () => {
    console.log("Clicked cancel button");      
    this.setState({
      visible: false
    });
    //TODO deselect row  
    this.state.selectedVariantRowKeys.pop();
    console.log("selected keys", this.state.selectedVariantRowKeys);
  };

  handleSubmit = e => {
    e.preventDefault();
    //TODO deploy selected variant to selected devices
    const { form } = this.formRef.props;
    form.validateFields((err, values) => {
      if (!err) {
        //values = this.removeDisabledFields(values);
        console.log("Form submited", values);
        //TODO return values to the parent
        this.setState({
          visible: false,
        });
      } else {
        message.warning("Please specify the deployment parameters!");
      }
    });
  };

  saveFormRef = formRef => {
    this.formRef = formRef;
  };

  render() {
    const { visible, confirmLoading, ModalText, current_step } = this.state;

    const { selectedVariantRowKeys } = this.state;
    const variantRowSelection = {
      columnTitle: " ", //this line is to hide the "Select all" checkbox
      selectedRowKeys: selectedVariantRowKeys,
      onChange: this.onVariantSelectChange,
      onSelect: this.onVariantSelect
      //type: "radio"
    };

    const { selectedDeviceRowKeys } = this.state;
    const deviceRowSelection = {
      selectedRowKeys: selectedDeviceRowKeys,
      onChange: this.onDeviceSelectChange
      //type: "radio"
    };

    const steps = [
      {
        title: "Variants",
        status: "process",
        content: (
          <div>
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
            {/* <Modal
              title={"Specify deployment parameters"}
              visible={visible}
              onOk={this.handleOk}
              confirmLoading={confirmLoading}
              onCancel={this.handleCancel}
            > */}
            <SMTForm
              wrappedComponentRef={this.saveFormRef}
              visible={this.state.visible}
              onCancel={this.handleCancel}
              onCreate={this.handleSubmit}
            />
            {/* </Modal> */}
          </div>
        )
      },
      {
        title: "Devices",
        status: "process",
        content: (
          <Table
            //bordered
            rowSelection={deviceRowSelection}
            rowKey={record => record.id}
            size="small"
            dataSource={this.props.devices}
            columns={this.deviceColumns}
            // expandedRowRender={record => (
            //   <span>
            //     <ReactJson src={record} enableClipboard={false} />
            //     <Table
            //       columns={this.nestedDeviceColumns}
            //       dataSource={
            //         this.props.activeDeployments[record.id]
            //           ? Object.values(this.props.activeDeployments[record.id])
            //           : []
            //       }
            //       pagination={false}
            //     />
            //   </span>
            // )}
            pagination={{ pageSize: 50 }}
          />
        )
      },
      {
        title: "Deployment parameters",
        status: "process",
        content: <SMTForm />
      },
      {
        title: "Matching devices",
        status: "process",
        content: (
          <Table
            //bordered
            rowSelection={deviceRowSelection}
            rowKey={record => record.id}
            size="small"
            dataSource={this.state.matchingDevices}
            columns={this.deviceColumns}
            expandedRowRender={record => (
              <span>
                <ReactJson src={record} enableClipboard={false} />
                <Table
                  columns={this.nestedDeviceColumns}
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

    //const { selectedFile } = this.state;
    // const z3_props = {
    //   name: "z3-file",
    //   accept: ".py",
    //   multiple: false,
    //   // onRemove: file => {
    //   //   this.setState(state => {
    //   //     const index = state.fileList.indexOf(file);
    //   //     const newFileList = state.fileList.slice();
    //   //     newFileList.splice(index, 1);
    //   //     return {
    //   //       fileList: newFileList
    //   //     };
    //   //   });
    //   // },
    //   beforeUpload: file => {
    //     this.setState(state => ({
    //       selectedFile: file
    //     }));
    //     return false;
    //   },
    //   selectedFile,
    //   //action: "/api/z3/",
    //   onChange(info) {
    //     const { status } = info.file;
    //     if (status !== "uploading") {
    //       console.log(info.file);
    //     }
    //     if (status === "done") {
    //       this.setState({ selectedFile: info.file });
    //       message.success(`${info.file.name} file uploaded successfully.`);
    //       console.log(this.state.selectedFile);
    //     } else if (status === "error") {
    //       message.error(`${info.file.name} file upload failed.`);
    //     }
    //   }
    // };

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

        <Row gutter={10}>
          <Col span={10} offset={1}>
            <Title level={4}>Parameters</Title>
            <SMTForm />
          </Col>
          <Col span={6}>
            <Title level={4}>
              Input JSON model
              <Button type="link" onClick={this.handleUpload}>
                {" "}
                Run
              </Button>
            </Title>

            <ReactJson
              theme="apathy:inverted"
              src={this.state.json_model}
              enableClipboard={true}
              onEdit={this.handleEdit}
              onAdd={this.handleEdit}
              onDelete={this.handleEdit}
            />
          </Col>
          <Col span={6}>
            <Row>
              <Title level={4}>Results</Title>
              <ReactJson
                src={this.state.result}
                enableClipboard={false}
                theme="apathy:inverted"
              />
            </Row>
            {/* <Row>
            <Dragger {...z3_props}>
              <p className="ant-upload-drag-icon">
                <Icon type="inbox" />
              </p>
              <p className="ant-upload-text">
                Click or drag fyour Z3 python script to upload
              </p>
            </Dragger>
          </Row>
          <Row>
            <Button
              type="primary"
              onClick={this.handleUpload}
              disabled={this.state.selectedFile === null}
              loading={uploading}
              style={{ marginTop: 16 }}
            >
              {uploading ? "Uploading" : "Submit"}
            </Button>
          </Row> */}
          </Col>
        </Row>
      </div>
    );
  }

  componentDidMount() {
    //TODO
  }
}
