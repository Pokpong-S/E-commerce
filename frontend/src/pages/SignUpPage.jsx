import React, { useState } from 'react';
import { Box, Button, Input, Heading, VStack, Text, Link ,Spinner} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAuthStore } from '../store/auth';
import validator from 'validator';
const SignUp = () => {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        confirmPassword: ''
    });
    const { signup, loading} = useAuthStore();
    const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }
    if (!validator.isStrongPassword(formData.password)) {
      toast.error("Passwords not strong.");
      return;
    }
    try {
      await signup(formData.username, formData.password);
      toast.success('Signup successful!');
      navigate('/');
    } catch (err) {
      toast.error(err.message || "Signup failed. Please try again.");
    }
    
};


  return (
    <Box maxW="md" mx="auto" mt={8} p={6} borderWidth={1} borderRadius="lg" boxShadow="lg" bg="white">
      <Heading mb={4} textAlign="center">Sign Up</Heading>
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
          <Input 
            placeholder="Confirm Password" 
            type="password" 
            name="confirmPassword" 
            value={formData.confirmPassword} 
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
              Sign Up
            </Button>
          )}
        </VStack>
      </form>
      <Text mt={4} textAlign="center">
        Already have an account? <Link color="teal.500" href="/login">Login here</Link>
      </Text>
    </Box>
  );
};

export default SignUp;
