import React, { useEffect, useState } from 'react';
import { Box, Button, Heading, VStack, Table, HStack } from '@chakra-ui/react';
import { useAdminStore } from '../store/admin.js';
import Pagination from '../components/pagination.jsx';

const AdminDashboard = () => {
  const {
    users,
    products,
    fetchUsers,
    fetchProducts,
    approveMerchant,
    rejectMerchant,
    deleteProduct,
    totalPages,
  } = useAdminStore();
  const [userPage, setUserPage] = useState(1);
  const [productPage, setProductPage] = useState(1);

  useEffect(() => {
    fetchUsers(userPage);
  }, [userPage]);

  useEffect(() => {
    fetchProducts(productPage);
  }, [productPage]);
  const handleApprove = async (id) => {
    await approveMerchant(id);
    fetchUsers(userPage); 
  };

  const handleReject = async (id) => {
    await rejectMerchant(id);
    fetchUsers(userPage); 
  };

  const handleDelete = async (id) => {
    await deleteProduct(id);
    fetchProducts(productPage); 
  };
  return (
    <Box p={8}>
      <Heading mb={4}>Admin Dashboard</Heading>
      <VStack align="stretch" spacing={8}>

        <Box>
          <Heading size="md" mb={4}>User Management</Heading>
          <Table.Root>
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
                        <Button colorPalette="green" onClick={() => handleApprove(user._id)}>Approve</Button>
                        <Button colorPalette="red" onClick={() => handleReject(user._id)}>Reject</Button>
                      </HStack>
                    )}
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
          <Pagination
            currentPage={userPage}
            totalPages={totalPages}
            onPrevious={() => setUserPage((prev) => prev - 1)}
            onNext={() => setUserPage((prev) => prev + 1)}
          />
        </Box>

        <Box>
          <Heading size="md" mb={4}>Product Management</Heading>
          <Table.Root>
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
                    <Button colorPalette="red" onClick={() => handleDelete(product._id)} variant="surface">Delete</Button>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
          <Pagination
            currentPage={productPage}
            totalPages={totalPages}
            onPrevious={() => setProductPage((prev) => prev - 1)}
            onNext={() => setProductPage((prev) => prev + 1)}
          />
        </Box>
      </VStack>
    </Box>
  );
};

export default AdminDashboard;
