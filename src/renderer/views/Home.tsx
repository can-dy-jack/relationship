import { Button, Flex, Form, Select, Space } from 'antd';
import { useEffect, useState } from 'react';
import { Character, Relationship } from '@prisma/client';
import SimpleGraph, { DataType } from '../components/RelationGraph';
import { exportFile } from '../utility';

export default function Home() {
  const [form] = Form.useForm();

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
        <Button
          type="link"
          onClick={async () => {
            const data = await window.apis.exportExcel();
            exportFile(data, '人物关系数据');
          }}
        >
          导出数据
        </Button>
      </Flex>
      {graphData && <SimpleGraph data={graphData} />}
    </Flex>
  );
}
