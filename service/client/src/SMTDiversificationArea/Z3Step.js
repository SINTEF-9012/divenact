import React, { Component } from "react";
import ReactJson from "react-json-view";
import { Col, Row, Typography, Input, Spin } from "antd";
import { DiversificationContext } from "./DiversificationContext";
import { Graph } from "react-d3-graph";

const { TextArea } = Input;
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
  "green",
];

const data = {
  nodes: [
    { id: "C", x: 50, y: 200 },
    { id: "D", x: 50, y: 250 },
    { id: "E", x: 50, y: 300 },
    { id: "F", x: 50, y: 350 },
    { id: "G", x: 50, y: 400 },
    { id: "dv0", x: 400, y: 20 },
    { id: "dv1", x: 400, y: 40 },
    { id: "dv2", x: 400, y: 60 },
    { id: "dv3", x: 400, y: 80 },
    { id: "dv4", x: 400, y: 100 },
    { id: "dv5", x: 400, y: 120 },
    { id: "dv6", x: 400, y: 140 },
    { id: "dv7", x: 400, y: 160 },
    { id: "dv8", x: 400, y: 180 },
    { id: "dv9", x: 400, y: 200 },
    { id: "dv10", x: 400, y: 220 },
    { id: "dv11", x: 400, y: 240 },
    { id: "dv12", x: 400, y: 260 },
    { id: "dv13", x: 400, y: 280 },
    { id: "dv14", x: 400, y: 300 },
    { id: "dv15", x: 400, y: 320 },
    { id: "dv16", x: 400, y: 340 },
    { id: "dv17", x: 400, y: 360 },
    { id: "dv18", x: 400, y: 380 },
    { id: "dv19", x: 400, y: 400 },
    { id: "dv20", x: 400, y: 420 },
    { id: "dv21", x: 400, y: 440 },
    { id: "dv22", x: 400, y: 460 },
    { id: "dv23", x: 400, y: 480 },
    { id: "dv24", x: 400, y: 500 },
  ],
  links: [
    { source: "C", target: "dv5" },
    { source: "C", target: "dv8" },
    { source: "C", target: "dv3" },
    { source: "C", target: "dv16" },

    { source: "D", target: "dv0" },
    { source: "D", target: "dv7" },
    { source: "D", target: "dv9" },
    { source: "D", target: "dv23" },

    { source: "E", target: "dv1" },
    { source: "E", target: "dv14" },
    { source: "E", target: "dv17" },
    { source: "E", target: "dv18" },

    { source: "F", target: "dv2" },
    { source: "F", target: "dv4" },
    { source: "F", target: "dv11" },
    { source: "F", target: "dv12" },

    { source: "G", target: "dv6" },
    { source: "G", target: "dv10" },
    { source: "G", target: "dv20" },
    { source: "G", target: "dv21" },
    { source: "G", target: "dv22" },
  ],
};

// the graph configuration, you only need to pass down properties
// that you want to override, otherwise default ones will be used
const myConfig = {
  nodeHighlightBehavior: true,
  staticGraph: true,
  height: 1000,
  node: {
    color: "lightgreen",
    size: 120,
    highlightStrokeColor: "blue",
  },
  link: {
    highlightColor: "lightblue",
  },
};

export class Z3Step extends Component {
  constructor(props) {
    super(props);
    this.state = {
      json_model: require("../resources/sample_input.json"),
    };
  }

  handleEdit = (json) => {
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
      <DiversificationContext.Consumer>
        {({ z3_solution }) => (
          <Row>
            <Col span={12}>
              <Title level={4}>Approve the solution for deployment</Title>
              <Spin tip="Loading..." spinning={z3_solution === ""}>
                {/*<TextArea rows={20} value={z3_solution} />*/}
                <ReactJson
                  src={z3_solution}
                  enableClipboard={false}
                  collapsed={2}
                  theme="apathy:inverted"
                />
              </Spin>

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
            {/* @Hui do we need some visual representation for the assignment? Or maybe even an editor? E.g. we can finlaise the assignment by some final fine tuning */}
            <Col span={12}>
              <Graph
                id="graph-id" // id is mandatory, if no id is defined rd3g will throw an error
                data={data}
                config={myConfig}
                /* onClickNode={onClickNode}
                  onDoubleClickNode={onDoubleClickNode}
                  onRightClickNode={onRightClickNode}
                  onClickGraph={onClickGraph}
                  onClickLink={onClickLink}
                  onRightClickLink={onRightClickLink}
                  onMouseOverNode={onMouseOverNode}
                  onMouseOutNode={onMouseOutNode}
                  onMouseOverLink={onMouseOverLink}
                  onMouseOutLink={onMouseOutLink}
                  onNodePositionChange={onNodePositionChange} */
              />
            </Col>
          </Row>
        )}
      </DiversificationContext.Consumer>
    );
  }

  componentDidMount() {
    //TODO
  }
}
