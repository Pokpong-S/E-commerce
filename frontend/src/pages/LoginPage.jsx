import React, { useState } from 'react';
import { Box, Button, Input, Heading, VStack, Text, Link,Spinner } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { toast} from 'react-toastify';
import { useAuthStore } from '../store/auth';
import 'react-toastify/dist/ReactToastify.css';

const Login = () => {
  const [formData, setFormData] = useState({ 
        username: '',
        password: '' 
    });
    const { login, loading} = useAuthStore();
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("Sending data to server:", formData);

    try {
      await login(formData.username, formData.password);
      toast.success('Login successful!');
      navigate('/');
    } catch (err) {
      toast.error(err.message || "Login failed. Please check your credentials and try again.");
    }
  };

  return (
    <Box maxW="md" mx="auto" mt={8} p={6} borderWidth={1} borderRadius="lg" boxShadow="lg" bg="white">
      <Heading mb={4} textAlign="center">Login</Heading>
      <form onSubmit={handleSubmit}>
        <VStack spacing={4}>
            <Input 
                placeholder="Username" 
                name="username" 
                value={formData.username} 
                onChange={handleChange} 
                required 
            />
            <Input 
                placeholder="Password" 
                type="password" 
                name="password" 
                value={formData.password} 
                onChange={handleChange} 
                required 
            />
            {loading ? (
              <Spinner size="xl" color="brand.500" /> 
            ) : (
              <Button 
                type="submit" 
                colorPalette="teal" 
                isLoading={loading}
                width="full"
              >
                Login
              </Button>
            )}
        </VStack>
      </form>
      <Text mt={4} textAlign="center">
        Don't have an account? <Link color="teal.500" href="/signup">Sign up here</Link>
      </Text>
    </Box>
  );
};

export default Login;
