import React, { Component } from "react";
import Axios from "axios";
import {
  Button,
  Layout,
  Col,
  Row,
  Upload,
  message,
  Icon,
  Alert,
  Result
} from "antd";

const { Content } = Layout;
const ButtonGroup = Button.Group;
const { Dragger } = Upload;
const { ErrorBoundary } = Alert;

export class Z3Area extends Component {
  constructor(props) {

    super(props);
    this.state = {
      result: "Result will be displayed here",
      selectedFile: null,
      uploading: false
    };
  }

  handleUpload = () => {
    const { selectedFile } = this.state;
    const formData = new FormData();
    formData.append("file", selectedFile);

    this.setState({
      uploading: true
    });

    Axios.post("/api/z3", formData)
      .then(res => {
        console.log("res", res.data);
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
    const { uploading, selectedFile } = this.state;
    const z3_props = {
      name: "z3-file",
      accept: ".py",
      multiple: false,
      // onRemove: file => {
      //   this.setState(state => {
      //     const index = state.fileList.indexOf(file);
      //     const newFileList = state.fileList.slice();
      //     newFileList.splice(index, 1);
      //     return {
      //       fileList: newFileList
      //     };
      //   });
      // },
      beforeUpload: file => {
        this.setState(state => ({
          selectedFile: file
        }));
        return false;
      },
      selectedFile,
      //action: "/api/z3/",
      onChange(info) {
        const { status } = info.file;
        if (status !== "uploading") {
          console.log(info.file);
        }
        if (status === "done") {
          this.setState({ selectedFile: info.file });
          message.success(`${info.file.name} file uploaded successfully.`);
          console.log(this.state.selectedFile);
        } else if (status === "error") {
          message.error(`${info.file.name} file upload failed.`);
        }
      }
    };

    return (
      <span>
        <Row>
          <Col span={20} offset={2}>
            <Dragger {...z3_props}>
              <p className="ant-upload-drag-icon">
                <Icon type="inbox" />
              </p>
              <p className="ant-upload-text">
                Click or drag fyour Z3 python script to upload
              </p>              
            </Dragger>
          </Col>
        </Row>
        <Row>
          <Col span={20} offset={2}>
            <Result
              icon={<Icon type="code" theme="twoTone" />}
              title={<Alert message={this.state.result} type="warning" />}
              extra={
                <Button
                  type="primary"
                  onClick={this.handleUpload}
                  disabled={this.state.selectedFile === null}
                  loading={uploading}
                  style={{ marginTop: 16 }}
                >
                  {uploading ? "Uploading" : "Start Upload"}
                </Button>
              }
            />
          </Col>
        </Row>
      </span>
    );
  }

  componentDidMount() {
    //TODO
  }
}
