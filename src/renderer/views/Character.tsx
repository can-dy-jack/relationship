import React, { useEffect, useState } from 'react'
import { Character } from '@prisma/client'
import { Button, Flex, message, Modal, Popconfirm, Space, Table, Form, Input, Select } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { useTableScroll } from '../hooks'

function Page() {
  const [data, setData] = useState<Character[]>([])
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [form] = Form.useForm()
  const [mode, setMode] = useState<'VIEW' | 'EDIT' | 'ADD'>('VIEW')
  const [curFormdata, setCurFormdata] = useState<any>({})

  const getData = () => {
    // TODO 不要手动查询所有 - 分页
    setLoading(true);
    window.apis
      .getCharacters()
      .then((res: Character[]) => {
        setData(res)
        setLoading(false);
        return false
      })
      .catch(() => {})
  }

  const handleOk = () => {
    if (mode === 'ADD') {
      form
        .validateFields({ validateOnly: true })
        .then(() => {
          window.apis
            .createCharacter(curFormdata?.name, curFormdata.comments, curFormdata.groups || [])
            .then(() => {
              setIsModalOpen(false)
              form.resetFields()
              getData()
              message.success('新增成功！')
              return true
            })
            .catch(message.error)
          return true
        })
        .catch(() => {})
    } else if (mode == 'EDIT') {
      // TODO 更新
    }
    // setIsModalOpen(false)
  }
  const onValuesChange = (_: any, d: any) => {
    setCurFormdata(d)
  }

  const handleCancel = () => {
    setCurFormdata({})
    form.resetFields()
    setIsModalOpen(false)
    setMode('VIEW')
  }

  const createData = () => {
    setIsModalOpen(true)
    setMode('ADD')
  }

  useEffect(() => {
    getData()
  }, [])

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange
  };

  const deleteItem = (d: any) => {
    window.apis
      .deleteCharacters([d.id])
      .then((res: any) => {
        message.success(`成功删除${res.count}条数据`)
        getData()
        return true
      })
      .catch(message.error)
  }
  const deleteItems = () => {
    window.apis
      .deleteCharacters(selectedRowKeys as number[])
      .then((res: any) => {
        message.success(`成功删除${res.count}条数据`)
        getData()
        return true
      })
      .catch(message.error)
  }

  const editItem = (d: any) => {
    form.setFieldsValue(d)
    setIsModalOpen(true)
    setMode('EDIT')
  }

  const columns = [
    { title: 'id', dataIndex: 'id', width: 80 },
    { title: '名字', dataIndex: 'name' },
    { title: '备注', dataIndex: 'comments' },
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
      align: 'center'
    }
  ]

  const hasSelected = selectedRowKeys.length > 0;
  const tableSrcollHeight = useTableScroll({ extraHeight: 100 });

  return (
    <div>
      <Flex gap="middle" vertical>
        <Flex align="center" gap="middle" justify="space-between">
          <div>{hasSelected ? `已选择 ${selectedRowKeys.length} 条数据` : null}</div>

          <Space>
            <Popconfirm
              title="确定删除？"
              description="注意：删除后无法还原！"
              onConfirm={deleteItems}
              onCancel={() => message.error('取消')}
              okText="Yes"
              cancelText="No"
            >
              <Button type="primary" danger disabled={!hasSelected} loading={loading}>
                批量删除
              </Button>
            </Popconfirm>
            <Button type="primary" onClick={createData} loading={loading} icon={<PlusOutlined />}>
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
            y: tableSrcollHeight
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
          <Form.Item name="name" label="人物名称" rules={[{ required: true }]}>
            <Input placeholder="" />
          </Form.Item>
          <Form.Item name="comments" label="备注" rules={[{ required: true }]}>
            <Input placeholder="" />
          </Form.Item>
          <Form.Item name="groups" label="所属组">
            <Select
              mode="multiple"
              allowClear
              style={{ width: '100%' }}
              placeholder="Please select"
              defaultValue={[]}
              // onChange={handleChange}
              // options={options}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default Page;
