import { Button, Dropdown, Flex, Form, Select, Space, message } from 'antd';
import { useEffect, useState } from 'react';
import { Character, Relationship } from '@prisma/client';
import SimpleGraph, { DataType } from '../components/RelationGraph';
import { exportFile } from '../utility';

export default function Home() {
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();

  const [rootId, setRootId] = useState<number>();

  const [characters, setCharacters] = useState<Character[]>([]);
  const [relations, setRelations] = useState<Relationship[]>([]);

  const [graphData, setGraphData] = useState<DataType>();

  useEffect(() => {
    window.apis
      .getCharactersWithoutGroup()
      .then((res: Character[]) => {
        setCharacters(res);
        return true;
      })
      // eslint-disable-next-line no-console
      .catch(console.warn);

    window.apis
      .getRelations({
        pagination: {
          current: 1,
          pageSize: 99999,
        },
      })
      .then((res) => {
        setRelations(res.data);
        return true;
      })
      // eslint-disable-next-line no-console
      .catch(console.warn);
  }, []);

  const start = () => {
    if (rootId) {
      const data = {
        rootId: `${rootId}`,
        nodes: characters.map((item) => ({
          id: `${item.id}`,
          text: item.name,
        })),
        lines: relations.map((item) => ({
          from: `${item.characterId}`,
          to: `${item.relativeCharactorId}`,
          text: item.relationName,
        })),
      };
      setGraphData(data);
    }
  };

  const onValuesChange = (d: any) => {
    setRootId(d.rootId);
  };

  return (
    <Flex gap={10} vertical style={{ height: '100%' }}>
      <Flex>
        <Form
          layout="inline"
          form={form}
          onValuesChange={onValuesChange}
          variant="filled"
          style={{ flex: 1 }}
        >
          <Form.Item
            name="rootId"
            label="选择核心人物"
            rules={[{ required: true }]}
          >
            <Select
              style={{ width: '100%' }}
              placeholder="Please select"
              options={characters}
              fieldNames={{
                value: 'id',
                label: 'name',
              }}
            />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" onClick={start}>
                开始绘制
              </Button>
            </Space>
          </Form.Item>
        </Form>
        <Dropdown
          menu={{
            items: [
              {
                key: '1',
                label: '导出所有数据到 Excel',
                onClick: async () => {
                  const data = await window.apis.exportExcel();
                  exportFile(data, '人物关系数据');
                },
              },
              {
                key: '2',
                label: '从 Excel 文件中导入',
                onClick: async () => {
                  messageApi.open({
                    type: 'warning',
                    content: '暂无导入功能',
                  });
                },
              },
            ],
          }}
          placement="bottom"
          arrow
        >
          <Button type="link">更多操作</Button>
        </Dropdown>
      </Flex>
      {graphData && <SimpleGraph data={graphData} />}
      {contextHolder}
    </Flex>
  );
}
