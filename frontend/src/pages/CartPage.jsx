import React, { useEffect, useState } from 'react';
import { Box, Button, VStack, Text, HStack, Image, Spinner} from '@chakra-ui/react';
import { Alert } from '@chakra-ui/react';
import { InfoIcon } from '@chakra-ui/icons'; 
import { useAuthStore } from '../store/auth';
import { useNavigate } from 'react-router-dom';

const CartPage = () => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [buying, setBuying] = useState(false);
  const { user, token } = useAuthStore();
  const navigate = useNavigate();

  const fetchCart = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/cart', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (res.ok) {
        setCart(data.data);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('An error occurred while fetching the cart.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (productId) => {
    try {
      const res = await fetch(`/api/cart/${productId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (res.ok) {
        setCart(data.data);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('An error occurred while deleting the item.');
    }
  };

  const handleBuy = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    setBuying(true);
    try {
      const res = await fetch('/api/cart/buy', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (res.ok) {
        alert('Purchase successful!');
        setCart(null); 
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('An error occurred while purchasing items.');
    } finally {
      setBuying(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  if (loading) return <Spinner size="xl" color="brand.500" />;

  if (error) {
    return (
      <Alert status="error" mb={4}>
        <InfoIcon boxSize={4} mr={2} />
        {error}
      </Alert>
    );
  }

  return (
    <Box p={8}>
      <Text fontSize="2xl" mb={4}>Your Cart</Text>
      {cart && cart.products.length === 0 ? (
        <Text>Your cart is empty.</Text>
      ) : (
        <VStack spacing={4} align="stretch">
          {cart.products.map((item) => (
            <HStack key={item.product._id} justifyContent="space-between" borderWidth="1px" p={4} borderRadius="lg">
              <HStack spacing={4}>
                <Image
                  src={`http://localhost:5000/uploads/${item.product.image}`}
                  alt={item.product.name}
                  boxSize="80px"
                  objectFit="cover"
                  borderRadius="md"
                />
                <VStack align="start" spacing={1}>
                  <Text fontWeight="bold">{item.product.name}</Text>
                  <Text>Quantity: {item.quantity}</Text>
                  <Text>${item.product.price}</Text>
                </VStack>
              </HStack>
              <Button colorScheme="red" onClick={() => handleDelete(item.product._id)}>Remove</Button>
            </HStack>
          ))}
          <Button colorScheme="green" mt={4} onClick={handleBuy} isLoading={buying}>
            Buy Now
          </Button>
        </VStack>
      )}
    </Box>
  );
};

export default CartPage;
