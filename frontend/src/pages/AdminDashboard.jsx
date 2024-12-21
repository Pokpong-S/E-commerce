import React, { useEffect, useState } from 'react';
import { Box, Button, Heading, VStack, Text, HStack, Table } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuthStore } from '../store/auth';

const base = import.meta.env.base_port;

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const { user } = useAuthStore();
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);

  const fetchUsers = async () => {
    try {
      const { data } = await axios.get(`${base}/admin/users?page=${page}`,
        {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
        }
      );
      if (data.success) {
        setUsers(data.data);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const fetchProducts = async () => {
    try {
      const { data } = await axios.get(`${base}/api/products?page=${page}`,
        {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
        });
      if (data.success) {
        setProducts(data.data);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchProducts();
  }, [page]);

  const handleApproveMerchant = async (id) => {
    try {
      await axios.post(`${base}/admin/approve/${id}`, 
        {},
        {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
        });
      fetchUsers();
    } catch (error) {
      console.error("Error approving merchant:", error);
    }
  };

  const handleRejectMerchant = async (id) => {
    try {
      await axios.post(`${base}/admin/reject/${id}`, 
        {},
        {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
        });
      fetchUsers();
    } catch (error) {
      console.error("Error rejecting merchant:", error);
    }
  };

  const handleDeleteProduct = async (id) => {
    try {
      await axios.delete(`${base}/api/products/${id}`,
        {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
        });
      fetchProducts();
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  return (
    <Box p={8}>
      <Heading mb={4}>Admin Dashboard</Heading>
      <VStack align="stretch" spacing={8}>

        <Box>
          <Heading size="md" mb={2}>User Management</Heading>
          <Table.Root size="sm">
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeader>Username</Table.ColumnHeader>
                <Table.ColumnHeader>Role</Table.ColumnHeader>
                <Table.ColumnHeader>Actions</Table.ColumnHeader>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {users.map((user) => (
                <Table.Row key={user._id}>
                  <Table.Cell>{user.username}</Table.Cell>
                  <Table.Cell>{user.role}</Table.Cell>
                  <Table.Cell>
                    {user.roleRequest === 'Merchant' && (
                      <HStack spacing={4}>
                        <Button colorPalette={"green"} variant="surface" onClick={() => handleApproveMerchant(user._id)}>
                          Approve
                        </Button>
                        <Button colorPalette={"red"} variant="surface" onClick={() => handleRejectMerchant(user._id)}>
                          Reject
                        </Button>
                      </HStack>
                    )}
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
        </Box>

        <Box>
          <Heading size="md" mb={2}>Product Management</Heading>
          <Table.Root size="sm">
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeader>Name</Table.ColumnHeader>
                <Table.ColumnHeader>Price</Table.ColumnHeader>
                <Table.ColumnHeader>Stock</Table.ColumnHeader>
                <Table.ColumnHeader>Actions</Table.ColumnHeader>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {products.map((product) => (
                <Table.Row key={product._id}>
                  <Table.Cell>{product.name}</Table.Cell>
                  <Table.Cell>${product.price}</Table.Cell>
                  <Table.Cell>{product.stock}</Table.Cell>
                  <Table.Cell>
                    <Button colorPalette={"red"} variant="surface" onClick={() => handleDeleteProduct(product._id)}>
                      Delete
                    </Button>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
        </Box>

        <HStack justifyContent="center" spacing={4}>
          <Button onClick={() => setPage((prev) => Math.max(prev - 1, 1))} colorPalette={"blue"} variant="outline">
            Previous
          </Button>
          <Text>Page {page}</Text>
          <Button onClick={() => setPage((prev) => prev + 1)} colorPalette={"blue"} variant="outline">
            Next
          </Button>
        </HStack>
      </VStack>
    </Box>
  );
};

export default AdminDashboard;
