import React, { useEffect, useState } from 'react';
import { Container, SimpleGrid, Text, VStack, Spinner, Button, HStack } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { useProductstore } from '../store/product';
import ProductCard from '../components/ProductCard.jsx';
import { useAuthStore } from '../store/auth.js';

const HomePage = () => {
  const { fetchProducts, products } = useProductstore();
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      const result = await fetchProducts(page);
      setTotalPages(result.totalPages || 1); 
      setLoading(false);
    };
    loadProducts();
  }, [fetchProducts, page]);

  const handleNextPage = () => {
    if (page < totalPages) setPage((prev) => prev + 1);
  };

  const handlePreviousPage = () => {
    if (page > 1) setPage((prev) => prev - 1);
  };

  return (
    <Container maxW="container.xl" py={12}>
      <VStack gap="20px">
        <Text
          fontSize="50"
          fontWeight="bold"
          bgGradient="to-r"
          gradientFrom="cyan.400"
          gradientTo="blue.700"
          bgClip="text"
          textAlign="center"
        >
          Current Products
        </Text>

        {loading ? (
          <Spinner size="xl" color="blue.400" />
        ) : (
          <SimpleGrid
            columns={{
              base: 1,
              md: 2,
              lg: 3,
            }}
            gap="40px"
            w="full"
          >
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </SimpleGrid>
        )}

        {!loading && products.length === 0 && (
          <Text fontSize="xl" textAlign="center" fontWeight="bold" color="gray.500">
            No Products found{' '}
            <Link to="/create">
              <Text as="span" color="blue.500" _hover={{ textDecoration: 'underline' }}>
                Create a product
              </Text>
            </Link>
          </Text>
        )}

        {!loading && (
          <HStack spacing={4} justifyContent="center">
            {page > 1 && (
              <Button onClick={handlePreviousPage}>
                Previous
              </Button>
            )}
            <Text>Page {page} of {totalPages}</Text>
            {page < totalPages && (
              <Button onClick={handleNextPage}>
                Next
              </Button>
            )}
          </HStack>
        )}
      </VStack>
    </Container>
  );
};

export default HomePage;
