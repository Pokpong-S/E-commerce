import React, { useEffect, useState } from 'react';
import { Container, SimpleGrid, Text, VStack, Spinner } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { useProductstore } from '../store/product';
import ProductCard from '../components/ProductCard.jsx';

const HomePage = () => {
  const { fetchProducts, products } = useProductstore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      await fetchProducts();
      setLoading(false);
    };
    loadProducts();
  }, [fetchProducts]);

  return (
    <Container maxW="container.xl" py={12}>
      <VStack gap="20px">
        <Text
          fontSize="30"
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
          <Spinner size="xl" color="brand.500" /> 
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
         )
        }

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
      </VStack>
    </Container>
  );
};

export default HomePage;
