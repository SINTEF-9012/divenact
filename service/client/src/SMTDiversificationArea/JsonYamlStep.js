import React, { Component } from "react";
import axios from "axios";
import ReactJson from "react-json-view";
import AceEditor from "react-ace";
import yaml from "js-yaml";
import readYaml from 'read-yaml';
import yaml_model from '../resources/sample_input.yml';
import { DiversificationContext } from "./DiversificationContext";
import { GlobalContext } from "../GlobalContext";

import "ace-builds/src-noconflict/mode-sass";
import "ace-builds/src-noconflict/theme-github";

import { Col, Row, Typography, Button, Icon } from "antd";

const { Title } = Typography;

export class JsonYamlStep extends Component {
  static contextType = DiversificationContext;

  constructor(props) {
    super(props);
    this.state = {
      json_model: require("../resources/sample_input.json"),
      yaml_model: require("../resources/sample_input.yml"),
    };
  }

  handleEdit = (json) => {
    this.setState({ json_model: json.updated_src });
    console.log(this.state.json_model);
  };

  handleUpload = () => {
    //const { selectedFile } = this.state;
    const formData = new FormData();
    //formData.append("files", selectedFile, "script.py");
    formData.append("json", JSON.stringify(this.state.json_model));

    this.setState({
      uploading: true,
    });

    axios
      .post("/api/z3", formData)
      .then((res) => {
        console.log("res.data", res.data);
        //this.setState({ result: res.data });
        this.context.setZ3Solution(res.data);
      })
      .catch((err) => {
        console.log("err", err);
      });

    this.setState({
      uploading: false,
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

    console.log(yaml_model.toString())
    console.log(this.state.yaml_model)
    console.log(this.state.yaml_model.toString())

    return (
      <Row gutter={10}>
        <Col span={12}>
          <Title level={4}>Verify the input JSON model</Title>
          <div id="" style={{overflow: "scroll", height: "400px"}} >
          <ReactJson
            src={Object.assign(
              this.context.deployment_list,
              this.context.device_list
            )}
            theme="apathy:inverted"
            collapsed={2}
            enableClipboard={true}
            onEdit={this.handleEdit}
            onAdd={this.handleEdit}
            onDelete={this.handleEdit}
          />
          </div>
        </Col>
        <Col span={12}>
          <Title level={4}>Verify the input YAML model</Title>
          <div id="" style={{overflow: "scroll", height: "400px"}} >
          <AceEditor
            mode="sass"
            //theme="github"
            //onChange={onChange}
            name="yaml_view"
            editorProps={{ $blockScrolling: true }}
            value={yaml.safeDump(
              Object.assign(
                this.context.deployment_list,
                this.context.device_list
              )
            )}
          />
          </div>
        </Col>        
      </Row>
    );
  }

  componentDidMount() {
    //TODO
  }
}