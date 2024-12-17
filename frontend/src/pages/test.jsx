import React, { useState } from 'react';
import { Box, Button, Input, Heading, VStack, Text, Alert} from '@chakra-ui/react';
import { useAuthStore } from '../store/auth';
import { InfoIcon } from '@chakra-ui/icons';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const SignUpPage = () => {
  const [formData, setFormData] = useState({ username: '', password: '', confirmPassword: '' });
  const { signup, loading, error } = useAuthStore();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
          toast.error("Passwords do not match.");
          setFormData({ ...formData, password: '', confirmPassword: '' });
          return;
    }
    await signup(formData.username, formData.password);

    if (!error) {
      toast.success('Signup successful!');
      navigate('/login');
    } else {
      toast.error(error);
    }
  };

  return (
    <Box maxW="md" mx="auto" mt={8} p={6} borderWidth={1} borderRadius="lg" boxShadow="lg" bg="white">
          <Heading mb={4} textAlign="center" color="brand.600">Sign Up</Heading>
          {error && (
            <Alert status="error" mb={4}>
              <InfoIcon boxSize={4} mr={2} />
              {error}
            </Alert>
          )}
          <form onSubmit={handleSubmit}>
            <VStack spacing={4}>
              <Box width="100%">
                <Text mb={1} fontWeight="bold">Username</Text>
                <Input
                  type="text"
                  name="username"
                  value={formData.username}
                  required
                  onChange={handleChange}
                />
              </Box>
    
              <Box width="100%">
                <Text mb={1} fontWeight="bold">Password</Text>
                <Input
                  type="password"
                  name="password"
                  value={formData.password}
                  required
                  onChange={handleChange}
                />
              </Box>
    
              <Box width="100%">
                <Text mb={1} fontWeight="bold">Confirm Password</Text>
                <Input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  required
                  onChange={handleChange}
                />
              </Box>
    
              <Button colorScheme="green" type="submit" isLoading={loading} width="full">
                Sign Up
              </Button>
            </VStack>
          </form>
          <Text mt={4} textAlign="center">
            Already have an account?{' '}
            <Link to="/login" style={{ color: '#2db162', textDecoration: 'underline' }}>
              Login here
            </Link>
          </Text>
        </Box>
  );
};

export default SignUpPage;
