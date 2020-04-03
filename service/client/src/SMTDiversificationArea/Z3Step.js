import React, { Component } from "react";
import ReactJson from "react-json-view";
import { Col, Row, Typography } from "antd";

const { Title } = Typography;
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

export class Z3Step extends Component {
  constructor(props) {
    super(props);
    this.state = {
      json_model: require("../resources/sample_input.json")
    };
  }

  handleEdit = json => {
    this.setState({ json_model: json.updated_src });
    console.log(this.state.json_model);
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
        <Col span={24}>
          <Title level={4}>Approve the solution for deployment</Title>
          <ReactJson
            src={this.props.result}
            enableClipboard={false}
            collapsed={2}
            theme="apathy:inverted"
          />

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
