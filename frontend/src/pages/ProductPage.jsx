import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Image, Text, Heading, VStack, Spinner, Stack, Button, Separator } from '@chakra-ui/react';
import { useProductstore } from '../store/product';
import { useCartStore } from '../store/cart';
import { useAuthStore } from '../store/auth';
import { toast } from 'react-toastify';

const ProductPage = () => {
  const { id } = useParams();
  const { products, fetchProducts } = useProductstore();
  const { addToCart } = useCartStore();
  const { user } = useAuthStore();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProduct = async () => {
      if (!products.length) {
        await fetchProducts();
      }
      const fetchedProduct = products.find((p) => p._id === id);
      setProduct(fetchedProduct);
      setLoading(false);
    };
    loadProduct();
  }, [fetchProducts, products, id]);

  const handleAddToCart = async () => {
    if (!user) {
      toast.error("You need to log in to add items to your cart.");
      return;
    }
    if (user.username === product.owner) {
      toast.error("You can't add your own product to the cart.");
      return;
    }
    try {
      await addToCart(product._id, 1);
      toast.success("Product added to cart!");
    } catch (error) {
      toast.error("Failed to add product to cart.");
    }
  };

  if (loading) {
    return (
      <Box textAlign="center" py={12}>
        <Spinner size="xl" color="cyan.400" />
        <Text mt={4} color="cyan.600">
          Loading product...
        </Text>
      </Box>
    );
  }

  if (!product) {
    return (
      <Box textAlign="center" py={12}>
        <Text fontSize="xl" color="red.500">
          Product not found.
        </Text>
      </Box>
    );
  }

  return (
    <Box maxW="container.lg" mx="auto" py={12} px={4} bg="cyan.50" rounded="lg" shadow="md">
      <Stack direction={{ base: 'column', md: 'row' }} spacing={8}>
        <Box w={{ base: 'full', md: '50%' }}>
          <Image
            src={`${import.meta.env.base_port}/uploads/${product.image}`}
            alt={product.name}
            w="full"
            rounded="lg"
            shadow="lg"
          />
          <Text
            mt={2}
            bg="teal.500"
            color="white"
            fontSize="sm"
            fontWeight="bold"
            px={3}
            py={1}
            rounded="md"
            textAlign="center"
          >
            Stock: {product.stock}
          </Text>
        </Box>

        <VStack align="start" spacing={4} w="full">
          <Heading size="lg">{product.name}</Heading>
          <Separator
            borderTopWidth="2px"
            borderColor="cyan.500"
            width="full"
          />
          <Text fontSize="md" color="gray.600">
            {product.description || 'No description available for this product.'}
          </Text>
          <Text fontWeight="bold" fontSize="2xl" color="blue.600">
            ${product.price.toFixed(2)}
          </Text>
          <Button colorScheme="cyan" size="md" onClick={handleAddToCart}>
            Add to Cart
          </Button>
        </VStack>
      </Stack>
    </Box>
  );
};

export default ProductPage;
