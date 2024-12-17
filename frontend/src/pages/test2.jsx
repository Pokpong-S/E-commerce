import React, { useState } from 'react';
import { Box, Button, Input, Heading, VStack, Text, Link } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Login = () => {
  const [formData, setFormData] = useState({ 
        username: '',
        password: '' 
    });
    const { login, loading, error } = useAuthStore();
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

  const handleSubmit = async (e) => {
    e.preventDefault();

    
      console.log("Sending data to server:", formData);
      await login(formData.username, formData.password);
    if(!error){
      toast.success('Login successful!');
      navigate('/');
    }else{
      toast.error(error || "Login failed. Please check your credentials and try again.");
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
            <Button 
                type="submit" 
                color="cyan.400"
                isLoading={loading}
                width="full"
            >
                Login
            </Button>
        </VStack>
      </form>
      <Text mt={4} textAlign="center">
        Don't have an account? <Link color="teal.500" href="/signup">Sign up here</Link>
      </Text>
    </Box>
  );
};

export default Login;
