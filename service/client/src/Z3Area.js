import React, { Component } from "react";
import axios from "axios";
import ReactJson from "react-json-view";
import { Typography } from "antd";
import {
  Button,
  Col,
  Row  
} from "antd";
import SMTForm from "./SMTForm"

const { Title } = Typography;

export class Z3Area extends Component {
  constructor(props) {
    super(props);
    this.state = {
      result: {},
      selectedFile: null,
      uploading: false,
      json_model: require("./resources/sample_input.json")
    };
  }

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

  render() {
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
      <Row gutter={10}>
        <Col span={10} offset={1}>
        <Title level={4}>Parameters</Title>
        <SMTForm/>
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
    );
  }

  componentDidMount() {
    //TODO
  }
}
