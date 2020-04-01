import React, { Component } from "react";
import axios from "axios";
import ReactJson from "react-json-view";
import {
  Button,
  Col,
  Row,
  Typography,
  Steps,
} from "antd";

const { Title } = Typography;

export class JsonStep extends Component {
  constructor(props) {
    super(props);
    this.state = {
      devices: this.props.devices,
      variants: this.props.variants,
      json_model: require("../resources/sample_input.json")
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
     
        <Row>
          <Col span={18} offset={3}>
            <Title level={4}>
              Verify the input JSON model              
            </Title>
            <ReactJson
              src={Object.assign(this.props.json_deployments, this.props.json_devices)}
              theme="apathy:inverted"
              collapsed={2}
              enableClipboard={true}
              onEdit={this.handleEdit}
              onAdd={this.handleEdit}
              onDelete={this.handleEdit}
            />
          </Col>
        </Row>
      
    );
  }

  componentDidMount() {
    //TODO
  }
}
