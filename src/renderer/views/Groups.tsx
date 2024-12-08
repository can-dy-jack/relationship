import React, { useEffect, useState } from 'react';
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
  TablePaginationConfig,
  TableProps,
  GetProp,
} from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { Group } from '@prisma/client';
import { SorterResult } from 'antd/es/table/interface';
import { useTableScroll } from '../hooks';

const { TextArea } = Input;

interface TableSearchParams {
  pagination?: TablePaginationConfig;
  sortField?: SorterResult<any>['field'];
  sortOrder?: SorterResult<any>['order'];
  filters?: Parameters<GetProp<TableProps, 'onChange'>>[1];
  searchStr?: string;
}

function Page() {
  const [data, setData] = useState<Group[]>([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [mode, setMode] = useState<'VIEW' | 'EDIT' | 'ADD'>('VIEW');
  const [curFormdata, setCurFormdata] = useState<any>({});
  const [curId, setCurId] = useState();
  const [tableParams, setTableParams] = useState<TableSearchParams>({
    pagination: {
      current: 1,
      pageSize: 10,
    },
  });

  const getData = () => {
    setLoading(true);
    window.apis
      .getGroups(tableParams)
      .then((res) => {
        setData(res.data);
        setTableParams({
          ...tableParams,
          pagination: {
            ...tableParams.pagination,
            total: res.total,
          },
        });
        setLoading(false);
        setCurId(undefined);
        return false;
      })
      .catch(() => {});
  };

  const handleOk = () => {
    if (mode === 'ADD') {
      form
        .validateFields({ validateOnly: true })
        .then(() => {
          window.apis
            .createGroup(curFormdata?.name, curFormdata.comments)
            .then(() => {
              setIsModalOpen(false);
              form.resetFields();
              getData();
              message.success('新增成功！');
              return true;
            })
            .catch(message.error);
          return true;
        })
        .catch(() => {});
    } else if (mode === 'EDIT' && curId) {
      form
        .validateFields({ validateOnly: true })
        .then(() => {
          window.apis
            .updateGroup(curId, curFormdata?.name, curFormdata.comments)
            .then(() => {
              setIsModalOpen(false);
              form.resetFields();
              getData();
              message.success('新增成功！');
              return true;
            })
            .catch(message.error);
          return true;
        })
        .catch(() => {});
    }
    // setIsModalOpen(false)
  };
  const onValuesChange = (_: any, d: any) => {
    setCurFormdata(d);
  };

  const handleCancel = () => {
    setCurFormdata({});
    form.resetFields();
    setIsModalOpen(false);
    setMode('VIEW');
  };

  const createData = () => {
    setIsModalOpen(true);
    setMode('ADD');
  };

  useEffect(() => {
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    tableParams.pagination?.current,
    tableParams.pagination?.pageSize,
    tableParams?.sortOrder,
    tableParams?.sortField,
    tableParams.searchStr,
  ]);

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const deleteItem = (d: any) => {
    window.apis
      .deleteGroups([d.id])
      .then((res: any) => {
        message.success(`成功删除${res.count}条数据`);
        getData();
        return true;
      })
      .catch(message.error);
  };
  const deleteItems = () => {
    window.apis
      .deleteGroups(selectedRowKeys as number[])
      .then((res: any) => {
        message.success(`成功删除${res.count}条数据`);
        getData();
        setSelectedRowKeys([]);
        return true;
      })
      .catch(message.error);
  };

  const editItem = (d: any) => {
    form.setFieldsValue(d);
    setCurId(d.id);
    setIsModalOpen(true);
    setMode('EDIT');
  };

  const columns: any = [
    { title: 'id', dataIndex: 'id', width: 80 },
    { title: '名字', dataIndex: 'name', sorter: true },
    { title: '备注', dataIndex: 'comments', sorter: true },
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
            description="注意：该分组的信息和属于该分组的人物的分组信息都将被删除，且删除后无法还原！"
            onConfirm={() => deleteItem(d)}
            onCancel={() => message.error('取消')}
            okText="确认"
            placement="left"
            cancelText="关闭"
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

  const onSearch = (value: string) => {
    setTableParams((prev) => ({
      ...prev,
      searchStr: value,
    }));
  };
  const handleTableChange: TableProps<any>['onChange'] = (
    pagination,
    filters,
    sorter,
  ) => {
    setTableParams((pre) => ({
      ...pre,
      pagination,
      filters,
      sortOrder: Array.isArray(sorter) ? undefined : sorter.order,
      sortField: Array.isArray(sorter) ? undefined : sorter.field,
    }));
    // `dataSource` is useless since `pageSize` changed
    if (pagination.pageSize !== tableParams.pagination?.pageSize) {
      setData([]);
    }
  };

  return (
    <div>
      <Flex gap="middle" vertical>
        <Flex align="center" gap="middle" justify="space-between">
          <div>
            {hasSelected ? `已选择 ${selectedRowKeys.length} 条数据` : null}
          </div>

          <Space>
            <Input.Search
              placeholder="搜索一下"
              onSearch={onSearch}
              // style={{ width: 200 }}
            />
            <Popconfirm
              title="确定删除？"
              description="注意：所有分组的信息和属于该分组的人物的分组信息都将被删除，且删除后无法还原！"
              onConfirm={deleteItems}
              onCancel={() => message.error('取消')}
              okText="确认"
              cancelText="关闭"
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
              新增组
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
          onChange={handleTableChange}
          pagination={tableParams.pagination}
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
          <Form.Item name="name" label="分组名称" rules={[{ required: true }]}>
            <Input placeholder="" />
          </Form.Item>
          <Form.Item name="comments" label="备注" rules={[{ required: true }]}>
            <TextArea rows={4} placeholder="备注一下" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default Page;
