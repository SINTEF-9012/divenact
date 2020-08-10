import React, { Component } from "react";
import {
  Button,
  Layout,
  Col,
  Row,
  Menu,
  Table,
  Popconfirm,
  Tooltip,
  Dropdown
} from "antd";
import axios from "axios";
import { JsonEditor as Editor } from "jsoneditor-react";
import "jsoneditor-react/es/editor.min.css";
import { GlobalContext } from "./GlobalContext";

const { Content } = Layout;
const ButtonGroup = Button.Group;

export class VariantArea2 extends Component {
  static contextType = GlobalContext;

  constructor(props) {
    super(props);
    this.columns = [
      {
        title: "Variant ID",
        dataIndex: "id"
      },
      {
        title: "Template",
        dataIndex: "template",
        render: (text, record) => (
          <Button type="link" onClick={() => this.context.handleTabChange("1")}>
            {record.template}
          </Button>
        )
      },
      {
        title: "Actions",
        width: 180,
        align: "center",
        render: (text, record) => (
          <span style={{ float: "right" }}>
            <ButtonGroup size="small" type="dashed">
              <Dropdown
                overlay={
                  <Menu>
                    <Menu.Item key="0">
                      <Button
                        type="link"
                        onClick={event =>
                          this.deployVariant(record, "production")
                        }
                      >
                        Production
                      </Button>
                    </Menu.Item>
                    <Menu.Divider />
                    <Menu.Item key="1">
                      <Button
                        type="link"
                        onClick={event => this.deployVariant(record, "preview")}
                      >
                        Preview
                      </Button>
                    </Menu.Item>
                    <Menu.Divider />
                    <Menu.Item key="3">
                      <Button
                        type="link"
                        onClick={event => this.deployVariant(record, "testing")}
                      >
                        Testing
                      </Button>
                    </Menu.Item>
                    <Menu.Divider />
                    <Menu.Item key="4">
                      <Button
                        type="link"
                        onClick={event =>
                          this.deployVariant(record, "safe-mode")
                        }
                      >
                        Safe mode
                      </Button>
                    </Menu.Item>
                  </Menu>
                }
              >
                <Tooltip title="Deploy to ...">
                  <Button type="primary" icon="rocket" ghost />
                </Tooltip>
              </Dropdown>
              <Tooltip title="View & Edit">
                <Button
                  type="primary"
                  icon="edit"
                  onClick={() => this.editVariant(record)}
                  ghost
                />
              </Tooltip>
              <Tooltip title="Copy">
                <Button
                  type="primary"
                  icon="copy"
                  onClick={() => this.copyVariant(record)}
                  ghost
                />
              </Tooltip>
              <Tooltip title="Save">
                <Button
                  type="primary"
                  icon="save"
                  onClick={() => {
                    this.saveVariant();
                  }}
                  ghost
                />
              </Tooltip>
              <Tooltip title="Delete">
                <Popconfirm
                  title="Sure to delete?"
                  onConfirm={() => this.deleteVariant(record.id)}
                >
                  <Button type="primary" icon="delete" ghost />
                </Popconfirm>
              </Tooltip>
            </ButtonGroup>
          </span>
        )
      }
    ];
    this.state = {
      //variants: [],
      forEdit: null,
      edited: null
    };
    this.editor = React.createRef();
  }

  render() {
    const { forEdit } = this.state;

    return (
      <Layout>
        <Content>
          <Row>
            <Col span={12}>
              <Table
                //bordered
                rowKey={record => record.id}
                size="small"
                dataSource={this.context.variants}
                columns={this.columns}
                pagination={{ pageSize: 50 }}
                scroll={{ y: true }}
              />
            </Col>
            <Col span={12}>
              <Editor
                history="true"
                value={forEdit}
                ref={this.editor}
                onChange={this.handleChange}
              />
            </Col>
          </Row>
        </Content>
      </Layout>
    );
  }

  handleExpandRow = (expanded, record) => {
    const expandedRows = [];
    if (expanded) {
      expandedRows.push(record.id);
    }
    this.setState({ expandedRows });
    //this.editVariant(record)
  };

  componentDidMount() {
    this.getVariants().then(result => {
      this.setState({ variants: result });
    });
  }

  handleChange = value => {
    this.setState({ edited: value });
  };

  getVariants = async () => {
    return (await axios.get("api/variant/")).data;
  };

  editVariant = record => {
    this.setState({ forEdit: record }, () => {
      this.editor.current.componentDidMount();
    });
  };

  deleteVariant = variantid => {
    axios.delete(`api/variant/${variantid}`);
  };

  saveVariant = async () => {
    const { edited } = this.state;
    if (edited) {
      await axios.put(`api/variant/${edited.id}`, edited);
      this.componentDidMount();
    } else {
      window.confirm("No change to save");
    }
  };

  copyVariant = async record => {
    const id = prompt("Enter new ID");

    if (!id) return;
    let newVariant = { ...record, id: id };
    delete newVariant._id;
    this.context.addVariant(newVariant);
    this.setState({
      //variants: [...this.state.variants, newVariant],
      edited: newVariant,
      foredit: newVariant
    });
  };

  /**
   * Create a deployment based on a template variant and an environment
   */
  deployVariant = async (variant, environment) => {
    console.log("Deploying variant: " + variant.id + " into " + environment);
    axios.put("/api/global/deploy/" + variant.id + "/" + environment);
  };
}
