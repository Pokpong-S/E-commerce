import React, { useState } from 'react';
import { Box, Button, Input, HStack, Text , IconButton } from '@chakra-ui/react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/auth';
import { CiShoppingCart , CiLogout } from "react-icons/ci";
import { LuSearch } from "react-icons/lu";
import { CgProfile } from "react-icons/cg";

const Navbar = () => {
  const { user, logout } = useAuthStore();
  const [search, setSearch] = useState('');
  const navigate = useNavigate();
  const handdlelogout = () => {
    console.log("hilogout");
    logout();
    navigate('/');
  }
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
          <IconButton onClick={handleSearch}>
              <LuSearch />
          </IconButton>
          {user ? (
            <>
              <Link to="/cart">
                <IconButton>
                  <CiShoppingCart />
                </IconButton>
              </Link>
              <Link to="/profile">
                <IconButton rounded="full">
                  <CgProfile />
                </IconButton>
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
              <IconButton onClick={handdlelogout} >
                  <CiLogout />
              </IconButton >
            </>
          ) : (
            <>
              <Link to="/login">
                <Button>
                  Login
                  </Button>
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
