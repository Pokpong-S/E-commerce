import React, { useEffect } from "react";
import { Box, Button, Text, VStack, HStack, Separator,Spinner, Heading} from "@chakra-ui/react";
import { useCartStore } from "../store/cart.js";
import { toast} from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
const CartPage = () => {
  const { cart, getCart, removeFromCart, updateCartQuantity,
    buyCartItems, loading, error, successMessage,
  } = useCartStore();
  const navigate = useNavigate();
  const handleBuy = async (e) => {
      e.preventDefault();
      try {
        await buyCartItems();
        toast.success('you purchase complete');
        toast.info('you can check purchaseHistory in your profile');
        navigate('/');
      } catch (err) {
        console.log(`error buying ${err}`)
        toast.error(err.message || "Login failed. Please try again.");
      }
  };

  useEffect(() => {
    getCart();
  }, [getCart]);

  return (
    <Box p={8}>
      <Heading mb={6}>Shopping Cart</Heading>
        
      {loading ? (
        <Spinner size="xl" color="brand.500" /> 
      ) : Array.isArray(cart) && cart.length === 0 ? (
        <Text>Your cart is empty.</Text>
      ) : Array.isArray(cart) ? (
        <VStack spacing={6} align="stretch">
          {cart.map((item) => (
            <Box
              key={item.product?._id || item._id} 
              p={4}
              borderWidth="1px"
              borderRadius="lg"
              boxShadow="sm"
            >
              <HStack justify="space-between">
                <VStack align="start">
                  <Text fontSize="lg" fontWeight="bold">
                    {item?.product?.name || "Unknown Product"}
                  </Text>
                  <Text>
                    Price: ${item?.product?.price ? item.product.price.toFixed(2) : "N/A"}
                  </Text>
                  <HStack>
                    <Button
                      size="sm"
                      onClick={() => updateCartQuantity(item.product?._id, item.quantity-1)}
                      isDisabled={item.quantity <= 1}
                    >
                      -
                    </Button>
                    <Text>{item.quantity || 1}</Text>
                    <Button
                      size="sm"
                      onClick={() => updateCartQuantity(item.product?._id, item.quantity+1)}
                    >
                      +
                    </Button>
                  </HStack>
                  <Button
                    colorScheme="red"
                    size="sm"
                    onClick={() => updateCartQuantity(item.product?._id,0)}
                  >
                    Delete
                  </Button>
                </VStack>
                <Text fontWeight="bold">
                  Subtotal: ${((item.quantity || 0) * (item.product?.price || 0)).toFixed(2)}
                </Text>
              </HStack>
            </Box>
          ))}

          <Separator />

          <HStack justify="space-between">
            <Text fontSize="xl" fontWeight="bold">
              Total: $
              {cart
                .reduce((total, item) => total + (item.quantity || 0) * (item.product?.price || 0), 0)
                .toFixed(2)}
            </Text>
            <Button colorScheme="teal" onClick={handleBuy}>
              Buy Now
            </Button>
          </HStack>
        </VStack>
      ) : (
        <Text>Loading...</Text>
      )}
    </Box>
  );
};

export default CartPage;
