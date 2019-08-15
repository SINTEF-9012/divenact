import React, { Component } from 'react';
import { Button, Layout, List, Col, Row, Select, Typography, Table } from 'antd';
import axios from 'axios';
import { JsonEditor as Editor } from 'jsoneditor-react';
import 'jsoneditor-react/es/editor.min.css';

const { Text } = Typography;
const { Header, Footer, Sider, Content } = Layout;

export var ModelContentAreaEnum = {
  TEMPLATE: 1,
  PRODUCTION: 2,
  PREVIEW: 3,
  DEFAULT: 4,
  properties: {
    1: { name: "template", value: 1, code: "T" },
    2: { name: "production", value: 2, code: "P" },
    3: { name: "preview", value: 2, code: "R" },
    4: { name: "default", value: 4, code: "F" }
  }
};



export class TemplateArea extends Component {
  constructor(props) {
    super(props);
    this.columns = [
      {
        title: 'ID',
        dataIndex: 'id',
      },
      {
        title: '',
        render: (text, record) => (
          <Button type="link" onClick={() => this.editTemplate(record)}> Edit </Button>
        )
      }
    ]
    this.state = {
      templates: [],
      forEdit: null
    };
  }

  componentDidMount() {
    this.getTemplates().then(result => { this.setState({ templates: result }) });
  }

  onSelectionChange = async (value) => {
    this.setState({ selected: value });
  }

  onNumberChange = async (value) => {
    this.setState({ number: value });
  }

  getTemplates = async () => {
    return (await axios.get('api/template/')).data;
  }

  onGoButton = async () => {

  }

  editTemplate = (record) => {
    this.setState({forEdit: record})
  }

  render() {
    const { templates, forEdit } = this.state
    return (
      <div>
        <Row>
          <Col span={10}>
            <Table
              bordered size='small'
              dataSource={templates}
              columns={this.columns}
            />
          </Col>
          <Col span={14}>
            {forEdit!=null && <Editor value={forEdit} />}
          </Col>
        </Row>
      </div>
    )
  }
}

