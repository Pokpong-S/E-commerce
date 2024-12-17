// ProfilePage.jsx
import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Text, 
  VStack, 
  Button, 
  useDisclosure, 
  HStack, 
  Heading, 
  Image, 
  Textarea 
} from '@chakra-ui/react';
import Modal from "react-modal";
import { useAuthStore } from '../store/auth.js';
import { useProductstore } from '../store/product.js';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ProfilePage = () => {
  const { user, purchaseHistory } = useAuthStore();
  const { products, deleteProduct } = useProductstore();
  const [requestDetails, setRequestDetails] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    Modal.setAppElement('#root'); // Ensure this matches your app's root element
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteProduct(id);
      toast.success("Product deleted successfully!");
    } catch (error) {
      toast.error("Error deleting product.");
    }
  };

  const handleRequestSubmit = async () => {
    if (!requestDetails.trim()) {
      toast.error("Please provide details for your request.");
      return;
    }

    try {
      const res = await fetch("http://localhost:5173/auth/request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ details: requestDetails }),
      });

      if (res.ok) {
        toast.success("Request submitted successfully!");
        setRequestDetails("");
      } else {
        const data = await res.json();
        throw new Error(data.message || "Failed to submit request.");
      }
    } catch (error) {
      toast.error(error.message || "Error submitting request.");
    } finally {
      onClose();
    }
  };

  return (
    <Box p={8}>
      <Heading mb={4} color="brand.700">Welcome, {user.username}</Heading>

      <VStack align="stretch" spacing={6}>
        {/* Purchase History Section */}
        <Box>
          <Heading size="md" mb={2} color="brand.600">Purchase History</Heading>
          {purchaseHistory.length === 0 ? (
            <Text>No purchases yet.</Text>
          ) : (
            <VStack spacing={4} align="stretch">
              {purchaseHistory.map((item, idx) => (
                <HStack key={idx} borderWidth="1px" borderRadius="lg" p={4} spacing={4}>
                  <Image
                    src={`http://localhost:5173/uploads/${item.image}`}
                    alt={item.name}
                    boxSize="100px"
                    objectFit="cover"
                    borderRadius="md"
                  />
                  <VStack align="start" spacing={1}>
                    <Text fontWeight="bold">{item.name}</Text>
                    <Text>${item.price}</Text>
                  </VStack>
                </HStack>
              ))}
            </VStack>
          )}
        </Box>

        {/* Request to Become a Merchant */}
        {user.role !== 'Merchant' && (
          <Box>
            <Button onClick={onOpen} colorScheme="cyan" mb={4}>
              Request to Become a Merchant
            </Button>
      
            <Modal
              isOpen={isOpen}
              onRequestClose={onClose}
              contentLabel="Request to Become a Merchant"
              style={{
                overlay: {
                  backgroundColor: "rgba(0, 0, 0, 0.5)",
                },
                content: {
                  maxWidth: "500px",
                  margin: "auto",
                  padding: "20px",
                  borderRadius: "8px",
                },
              }}
            >
              <Heading size="lg" mb={4}>Request to Become a Merchant</Heading>
              <Textarea
                placeholder="What do you want to sell?"
                value={requestDetails}
                onChange={(e) => setRequestDetails(e.target.value)}
                size="md"
              />
              <VStack mt={4} align="flex-end">
                <Button onClick={handleRequestSubmit} colorScheme="blue" mr={2}>
                  Submit
                </Button>
                <Button onClick={onClose} colorScheme="gray">
                  Cancel
                </Button>
              </VStack>
            </Modal>
          </Box>
        )}

        {/* Merchant's Products Section */}
        {user.role === 'Merchant' && (
          <Box>
            <Heading size="md" mb={2} color="brand.600">Your Products</Heading>
            {products.length === 0 ? (
              <Text>No products yet.</Text>
            ) : (
              <VStack spacing={4} align="stretch">
                {products
                  .filter((product) => product.owner === user.username) // Assuming 'owner' is username
                  .map((product) => (
                    <HStack key={product._id} borderWidth="1px" borderRadius="lg" p={4} spacing={4}>
                      <Image
                        src={`http://localhost:5173/uploads/${product.image}`}
                        alt={product.name}
                        boxSize="100px"
                        objectFit="cover"
                        borderRadius="md"
                      />
                      <VStack align="start" spacing={1} flex="1">
                        <Text fontWeight="bold">{product.name}</Text>
                        <Text>${product.price}</Text>
                        <Text>Stock: {product.stock}</Text>
                      </VStack>
                      <Button 
                        colorScheme="red" 
                        onClick={() => handleDelete(product._id)}
                      >
                        Delete
                      </Button>
                    </HStack>
                  ))}
              </VStack>
            )}
          </Box>
        )}
      </VStack>
    </Box>
  );
};

export default ProfilePage;
