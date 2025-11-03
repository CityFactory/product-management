'use client';

import React, { useState, useEffect, useMemo, ChangeEvent } from 'react';
import axios from 'axios';
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  InputNumber,
  Space,
  Typography,
  Pagination,
  Layout,
  App,
  Popconfirm,
  Spin,
  TableProps,
} from 'antd';

const { Search } = Input;
const { Title } = Typography;
const { Content } = Layout;
const { TextArea } = Input;

interface Product {
  product_id: string;
  product_title: string;
  product_price: number;
  product_description?: string;
  product_image?: string;
  product_category?: string;
  created_timestamp: string;
  updated_timestamp: string;
}

interface ProductListParams {
  page: number;
  limit: number;
  search?: string;
}

interface ApiResponse {
  data: Product[];
  total: number;
  page: number;
  limit: number;
}

type ModalMode = 'create' | 'edit';

function useDebounce(value: string, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

const ProductPage: React.FC = () => {
  const [form] = Form.useForm();
  const { message } = App.useApp(); // <-- BARIS INI HILANG

  const [products, setProducts] = useState<Product[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [params, setParams] = useState<ProductListParams>({
    page: 1,
    limit: 10,
    search: '',
  });

  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearch = useDebounce(searchQuery, 300);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<ModalMode>('create');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [modalLoading, setModalLoading] = useState(false);

  const fetchProducts = async (currentParams: ProductListParams) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get<ApiResponse>('/api/products', {
        params: {
          ...currentParams,
          search: currentParams.search || undefined,
        },
      });
      setProducts(response.data.data);
      setTotalItems(response.data.total);
    } catch (err) {
      console.error(err);
      setError('Gagal memuat data produk.');
      message.error('Gagal memuat data produk.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const paramsToFetch = {
      ...params,
      page: debouncedSearch !== params.search ? 1 : params.page,
      search: debouncedSearch,
    };

    if (
      paramsToFetch.page !== params.page ||
      paramsToFetch.search !== params.search
    ) {
      setParams(paramsToFetch);
    }

    fetchProducts(paramsToFetch);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);

  useEffect(() => {
    if (debouncedSearch === params.search) {
      fetchProducts(params);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.page, params.limit]);

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handlePaginationChange = (page: number, pageSize: number) => {
    setParams((prev) => ({
      ...prev,
      page,
      limit: pageSize,
    }));
  };

  const showCreateModal = () => {
    setModalMode('create');
    setEditingProduct(null);
    form.resetFields();
    setModalOpen(true);
  };

  const showEditModal = (record: Product) => {
    setModalMode('edit');
    setEditingProduct(record);
    form.setFieldsValue({
      ...record,
      product_price: Number(record.product_price),
    });
    setModalOpen(true);
  };

  const handleModalCancel = () => {
    setModalOpen(false);
    setEditingProduct(null);
  };

  const handleFormSubmit = async () => {
    try {
      const values = await form.validateFields();
      setModalLoading(true);

      if (modalMode === 'create') {
        await axios.post('/api/product', values);
        message.success('Produk berhasil ditambahkan');
      }

      if (modalMode === 'edit' && editingProduct) {
        await axios.put(
          `/api/product?product_id=${editingProduct.product_id}`,
          values
        );
        message.success('Produk berhasil diperbarui');
      }

      setModalOpen(false);
      setEditingProduct(null);
      fetchProducts(params);
    } catch (err) {
      console.error('Form submit error:', err);
      message.error('Terjadi kesalahan. Silakan coba lagi.');
    } finally {
      setModalLoading(false);
    }
  };

  const handleDelete = async (productId: string) => {
    try {
      await axios.delete(`/api/product?product_id=${productId}`);
      message.success('Produk berhasil dihapus');
      fetchProducts(params);
    } catch (err) {
      console.error('Delete error:', err);
      message.error('Gagal menghapus produk. Backend mungkin tidak mendukung.');
    }
  };

  const columns = useMemo(
    () =>
      [
        {
          title: 'Product Title',
          dataIndex: 'product_title',
          key: 'product_title',
        },
        {
          title: 'Price',
          dataIndex: 'product_price',
          key: 'product_price',
          render: (price: number) =>
            `Rp ${Number(price).toLocaleString('id-ID')}`,
        },
        {
          title: 'Category',
          dataIndex: 'product_category',
          key: 'product_category',
        },
        {
          title: 'Description',
          dataIndex: 'product_description',
          key: 'product_description',
          ellipsis: true,
        },
        {
          title: 'Actions',
          key: 'actions',
          render: (_: any, record: Product) => (
            <Space size="middle">
              <Button type="link" onClick={() => showEditModal(record)}>
                Edit
              </Button>
              <Popconfirm
                title="Hapus produk?"
                description="Apakah Anda yakin ingin menghapus produk ini?"
                onConfirm={() => handleDelete(record.product_id)}
                okText="Ya"
                cancelText="Tidak"
              >
                <Button type="link" danger>
                  Delete
                </Button>
              </Popconfirm>
            </Space>
          ),
        },
      ] as TableProps<Product>['columns'],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [params] // Tambahkan params sebagai dependensi
  );

  return (
    <Layout style={{ padding: '24px', minHeight: '100vh' }}>
      <Content style={{ padding: '24px', backgroundColor: '#fff' }}>
        <Spin spinning={loading && !modalLoading} tip="Memuat data...">
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <Title level={2}>Product Management</Title>

            <Space
              style={{ width: '100%', justifyContent: 'space-between' }}
            >
              <Search
                placeholder="Cari produk (Judul, Deskripsi, Kategori)..."
                onChange={handleSearch}
                value={searchQuery}
                style={{ width: 400 }}
                allowClear
              />
              <Button type="primary" onClick={showCreateModal}>
                Create Product
              </Button>
            </Space>

            <Table
              columns={columns}
              dataSource={products}
              rowKey="product_id"
              pagination={false}
              loading={loading}
            />

            <Pagination
              current={params.page}
              pageSize={params.limit}
              total={totalItems}
              onChange={handlePaginationChange}
              showSizeChanger
              style={{ textAlign: 'right' }}
            />
          </Space>
        </Spin>

        <Modal
          title={modalMode === 'create' ? 'Create New Product' : 'Edit Product'}
          open={modalOpen}
          onCancel={handleModalCancel}
          onOk={handleFormSubmit}
          confirmLoading={modalLoading}
          destroyOnHidden
        >
          <Form
            form={form}
            layout="vertical"
            name="product_form"
            initialValues={{ product_price: 0 }}
          >
            <Form.Item
              name="product_title"
              label="Product Title"
              rules={[
                { required: true, message: 'Silakan masukkan judul produk!' },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="product_price"
              label="Price"
              rules={[
                { required: true, message: 'Silakan masukkan harga produk!' },
              ]}
            >
              <InputNumber min={0} style={{ width: '100%' }} prefix="Rp" />
            </Form.Item>

            <Form.Item name="product_category" label="Category">
              <Input />
            </Form.Item>

            <Form.Item name="product_description" label="Description">
              <TextArea rows={4} />
            </Form.Item>

            <Form.Item name="product_image" label="Image URL">
              <Input placeholder="https://example.com/image.png" />
            </Form.Item>
          </Form>
        </Modal>
      </Content>
    </Layout>
  );
};

export default ProductPage;