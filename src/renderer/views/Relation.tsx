import React, { useEffect, useState } from 'react';
import { Relationship, Character } from '@prisma/client';
import {
  Button,
  Flex,
  message,
  Modal,
  Popconfirm,
  Space,
  Table,
  Form,
  Input,
  Select,
} from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useTableScroll } from '../hooks';

type RelationshipInfo = Relationship & {
  character: Character;
  relativeCharactor: Character;
};

type DataType = {
  id: number;
  name: string;
  charId: number;
  charactorName: string;
  reCharId: number;
  ReCharactorName: string;
};

export default function RelationPage() {
  const [data, setData] = useState<DataType[]>([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [mode, setMode] = useState<'VIEW' | 'EDIT' | 'ADD'>('VIEW');
  const [curFormdata, setCurFormdata] = useState<any>({});
  const [curId, setCurId] = useState();

  const [options, setOptions] = useState<any[]>([]);

  useEffect(() => {
    window.apis
      .getCharactersWithoutGroup()
      .then((res: Character[]) => {
        return setOptions(
          res.map((item) => ({ value: item.id, label: item.name })),
        );
      })
      .catch(() => {});
  }, []);

  const getData = () => {
    // TODO 分页
    setLoading(true);
    window.apis
      .getRelations()
      .then((res: RelationshipInfo[]) => {
        setData(
          res.map((item) => ({
            id: item.id,
            name: item.relationName,
            charactorName: item.character.name,
            charId: item.character.id,
            ReCharactorName: item.relativeCharactor.name,
            reCharId: item.relativeCharactor.id,
          })),
        );
        setLoading(false);
        setCurId(undefined);
        return false;
      })
      .catch(() => {});
  };

  const handleOk = () => {
    form
      .validateFields({ validateOnly: true })
      .then(() => {
        if (mode === 'ADD') {
          window.apis
            .createRelation(
              curFormdata?.charId,
              curFormdata.reCharId,
              curFormdata.name,
            )
            .then(() => {
              setIsModalOpen(false);
              form.resetFields();
              getData();
              message.success('新增成功！');
              return true;
            })
            .catch(message.error);
        } else {
          window.apis
            .updateRelation(curId!, curFormdata.name)
            .then(() => {
              setIsModalOpen(false);
              form.resetFields();
              getData();
              message.success('更新成功！');
              return true;
            })
            .catch(message.error);
        }
        return true;
      })
      .catch(() => {});
    setCurId(undefined);
  };
  const onValuesChange = (_: any, d: any) => {
    setCurFormdata(d);
  };

  const handleCancel = () => {
    setCurFormdata({});
    form.resetFields();
    setIsModalOpen(false);
    setMode('VIEW');
    setCurId(undefined);
  };

  const createData = () => {
    setIsModalOpen(true);
    setMode('ADD');
  };

  useEffect(() => {
    getData();
  }, []);

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const deleteItem = (d: any) => {
    window.apis
      .deleteRelation([d.id])
      .then((res: any) => {
        message.success(`成功删除${res.count}条数据`);
        getData();
        return true;
      })
      .catch(message.error);
  };
  const deleteItems = () => {
    window.apis
      .deleteRelation(selectedRowKeys as number[])
      .then((res: any) => {
        message.success(`成功删除${res.count}条数据`);
        getData();
        return true;
      })
      .catch(message.error);
  };

  const editItem = (d: any) => {
    const item = { ...d }; // 很重要，不要改变原数据
    if (item.groups) {
      item.groups = item.groups.map((item2: any) => item2.groupId);
    }
    setCurId(d.id);
    form.setFieldsValue(item);
    setIsModalOpen(true);
    setMode('EDIT');
  };

  const columns: any = [
    { title: 'id', dataIndex: 'id', width: 80 },
    { title: '人物', dataIndex: 'charactorName' },
    { title: '相关人物', dataIndex: 'ReCharactorName' },
    { title: '关系', dataIndex: 'name' },
    {
      title: '操作列',
      key: 'tags',
      dataIndex: '',
      render: (d: any) => (
        <Space>
          <Button type="link" onClick={() => editItem(d)} loading={loading}>
            编辑
          </Button>
          <Popconfirm
            title="确定删除？"
            description="注意：删除后无法还原！"
            onConfirm={() => deleteItem(d)}
            onCancel={() => message.error('取消')}
            okText="Yes"
            placement="left"
            cancelText="No"
          >
            <Button type="link" danger loading={loading}>
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
      width: 150,
      align: 'center',
    },
  ];

  const hasSelected = selectedRowKeys.length > 0;
  const tableSrcollHeight = useTableScroll({ extraHeight: 100 });

  return (
    <div>
      <Flex gap="middle" vertical>
        <Flex align="center" gap="middle" justify="space-between">
          <div>
            {hasSelected ? `已选择 ${selectedRowKeys.length} 条数据` : null}
          </div>

          <Space>
            <Popconfirm
              title="确定删除？"
              description="注意：删除后无法还原！"
              onConfirm={deleteItems}
              onCancel={() => message.error('取消')}
              okText="Yes"
              cancelText="No"
            >
              <Button
                type="primary"
                danger
                disabled={!hasSelected}
                loading={loading}
              >
                批量删除
              </Button>
            </Popconfirm>
            <Button
              type="primary"
              onClick={createData}
              loading={loading}
              icon={<PlusOutlined />}
            >
              新增人物
            </Button>
          </Space>
        </Flex>
        <Table
          rowSelection={rowSelection}
          columns={columns}
          dataSource={data}
          loading={loading}
          rowKey="id"
          bordered
          scroll={{
            y: tableSrcollHeight,
          }}
        />
      </Flex>

      <Modal
        title={mode === 'ADD' ? '新增' : '编辑'}
        maskClosable={false}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form
          layout="vertical"
          form={form}
          onValuesChange={onValuesChange}
          // style={{ maxWidth: formLayout === 'inline' ? 'none' : 600 }}
        >
          <Form.Item name="charId" label="人物" rules={[{ required: true }]}>
            <Select
              style={{ width: '100%' }}
              placeholder="Please select"
              options={options}
            />
          </Form.Item>
          <Form.Item
            name="reCharId"
            label="相关人物"
            dependencies={['charId']}
            rules={[
              {
                required: true,
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('charId') !== value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('不能选择相同的人物'));
                },
              }),
            ]}
          >
            <Select
              style={{ width: '100%' }}
              placeholder="Please select"
              options={options}
            />
          </Form.Item>
          <Form.Item name="name" label="关系" rules={[{ required: true }]}>
            <Input.TextArea rows={4} placeholder="" maxLength={6} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
