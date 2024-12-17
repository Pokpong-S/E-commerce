import React, { useEffect, useState } from 'react';
import { Box,Button, Heading, VStack, Text, HStack} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
const AdminDashboard = () => {
    const [users, setUsers] = useState([]);
    const [products, setProducts] = useState([]);
    const [page, setPage] = useState(1);
    const navigate = useNavigate();

    const fetchUsers = async () => {
        const res = await fetch(`/api/admin/users?page=${page}`);
        const data = await res.json();
        if (data.success) setUsers(data.data);
    };

    const fetchProducts = async () => {
        const res = await fetch(`/api/products?page=${page}`);
        const data = await res.json();
        if (data.success) setProducts(data.data);
    };

    useEffect(() => {
        fetchData();
    }, [page]);

    const handleApproveMerchant = async (id) => {
        await fetch(`/api/admin/approve/${id}`, { method: 'POST' });
        fetchUsers();
    };
    
    const handleRejectMerchant = async (id) => {
        await fetch(`/api/admin/reject/${id}`, { method: 'POST' });
        fetchUsers();
    };
    
    const handleDeleteProduct = async (id) => {
        await fetch(`/api/products/${id}`, { method: 'DELETE' });
        fetchProducts();
    };

    return (
        <Box p={8}>
            <Heading mb={4}>Admin Dashboard</Heading>
                <VStack align="stretch" spacing={8}>
                    <Box>
                    <Heading size="md" mb={2}>User Management</Heading>
                    <table variant="simple">
                        <thead>
                        <Tr>
                            <th>Username</th>
                            <th>Role</th>
                            <th>Actions</th>
                        </Tr>
                        </thead>
                        <tbody>
                        {users.map((user) => (
                            <tr key={user._id}>
                            <td>{user.username}</td>
                            <td>{user.role}</td>
                            <td>
                                {user.roleRequest === 'Merchant' && (
                                <HStack>
                                    <Button colorScheme="green" onClick={() => handleApproveMerchant(user._id)}>
                                    Approve
                                    </Button>
                                    <Button colorScheme="red" onClick={() => handleRejectMerchant(user._id)}>
                                    Reject
                                    </Button>
                                </HStack>
                                )}
                            </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                    </Box>

                    <Box>
                    <Heading size="md" mb={2}>Product Management</Heading>
                    <Table variant="simple">
                        <Thead>
                        <Tr>
                            <Th>Name</Th>
                            <Th>Price</Th>
                            <Th>Stock</Th>
                            <Th>Actions</Th>
                        </Tr>
                        </Thead>
                        <Tbody>
                        {products.map((product) => (
                            <Tr key={product._id}>
                            <td>{product.name}</td>
                            <td>${product.price}</td>
                            <td>{product.stock}</td>
                            <td>
                                <Button colorScheme="red" onClick={() => handleDeleteProduct(product._id)}>
                                Delete
                                </Button>
                            </td>
                            </Tr>
                        ))}
                        </Tbody>
                    </Table>
                    </Box>

                    <HStack justifyContent={"center"}>
                        <Button onClick={() => setPage((prev) => Math.max(prev - 1, 1))} colorScheme="brand">
                            Previous
                        </Button>
                        <Text>Page {page}</Text>
                        <Button onClick={() => setPage((prev) => prev +1)}colorScheme={"brand"}>
                            Next
                        </Button>
                    </HStack>
                </VStack>
        </Box>
    )
}

export default AdminDashboard



