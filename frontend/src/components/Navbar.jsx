import React, { useState } from 'react';
import { Box, Button, Input, HStack, Text } from '@chakra-ui/react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/auth';

const Navbar = () => {
  const { user, logout } = useAuthStore();
  const [search, setSearch] = useState('');
  const navigate = useNavigate();
  
  const handleSearch = () => {
    navigate(`/?search=${search}`);
  };

  return (
    <Box p={4} bg="gray.200">
      <HStack justify="space-between">
        <Text fontSize="2xl">
          <Link to="/">Product Store </Link>
        </Text>
        <HStack>
          <Input
            placeholder="Search products..."
            value={search}
            bg="cyan.100"
            borderColor="cyan.400"
            _hover={{ borderColor: "cyan.600" }}
            _focus={{ borderColor: "cyan.700" }}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Button onClick={handleSearch}>Search</Button>
          {user ? (
            <>
              <Link to="/cart">
                <Button>Cart</Button>
              </Link>
              <Link to="/profile">
                <Button>Profile</Button>
              </Link>
              {user.role === 'Merchant' && (
                <Link to="/create">
                  <Button>Create Product</Button>
                </Link>
              )}
              {user.role === 'admin' && (
                <Link to="/admin">
                  <Button>Admin</Button>
                </Link>
              )}
              <Button onClick={() => { navigate('/') ,logout}}>Logout</Button>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button>Login</Button>
              </Link>
              <Link to="/signup">
                <Button>Sign Up</Button>
              </Link>
            </>
          )}
        </HStack>
      </HStack>
    </Box>
  );
};

export default Navbar;
