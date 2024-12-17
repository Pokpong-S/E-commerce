import {
    Box,
    Button,
    Heading,
    HStack,
    VStack,
    Image,
    Text,
    Input,
  } from "@chakra-ui/react";
  import React, { useState } from "react";
  import Modal from "react-modal";
  import { modalCustomStyles } from "../styles/modalStyles";
  import { useColorModeValue } from "./ui/color-mode";
  import { useProductstore } from "../store/product";
  import { toast } from "react-toastify";
  import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
  
  Modal.setAppElement("#root");
  
  const ProductCard = ({ product }) => {
    const [updatedProduct, setUpdatedProduct] = useState(product);
    const [isOpen, setIsOpen] = useState(false);
    
    const textColor = useColorModeValue("gray.600", "gray.200");
    const bg = useColorModeValue("white", "gray.400");

    const { updateProduct } = useProductstore();
    const { deleteProduct } = useProductstore();
  
    const handleDeleteProduct = async (ID) => {
      const { success, message } = await deleteProduct(ID);
      if (!success) {
        toast.error(message);
      } else {
        toast.success(message);
      }
    };
  
    const handleUpdateProduct = async (productID, updatedProduct) => {
        try {
            const { success, message } = await updateProduct(productID, updatedProduct);
        
            if (success) {
              toast.success(message || "Product updated successfully!");
            } else {
              toast.error(message || "Failed to update product.");
            }
          } catch (error) {
            console.error("Error updating product:", error);
            toast.error("An unexpected error occurred.");
          } finally {
            setIsOpen(false);
          }
    };
  
    return (
      <Box
        shadow="lg"
        rounded="lg"
        overflow="hidden"
        transition="all 0.3s"
        _hover={{ transform: "translateY(-5px)", shadow: "xl" }}
        bg={bg}
      >
        <Image src={product.image} alt={product.name} h={48} w="full" objectFit="cover" />
  
        <Box p={4}>
          <Heading as="h3" size="md" mb={2}>
            {product.name}
          </Heading>
  
          <Text fontWeight="bold" fontSize="xl" color={textColor} mb={4}>
            ${product.price}
          </Text>
  
          <HStack spacing={2}>
            <Button 
                colorPalette="cyan" 
                variant="surface" 
                onClick={() => setIsOpen(true)}
            >
              <EditIcon fontSize={15} />
            </Button>
            <Button
              colorPalette="red"
              variant="surface"
              onClick={() => handleDeleteProduct(product._id)}
            >
              <DeleteIcon fontSize={15} />
            </Button>
          </HStack>
        </Box>
  
        <Modal
          isOpen={isOpen}
          onRequestClose={() => setIsOpen(false)}
          style={modalCustomStyles} 
        >
          <Heading size="md" mb={4}>
            Edit Product
          </Heading>
          <VStack spacing={4}>
            <Input
              placeholder="Product Name"
              name="name"
              value={updatedProduct.name}
              onChange={(e) =>
                setUpdatedProduct({ ...updatedProduct, name: e.target.value })
              }
            />
            <Input
              placeholder="Price"
              name="price"
              type="number"
              value={updatedProduct.price}
              onChange={(e) =>
                setUpdatedProduct({ ...updatedProduct, price: e.target.value })
              }
            />
            <Input
              placeholder="Image URL"
              name="image"
              value={updatedProduct.image}
              onChange={(e) =>
                setUpdatedProduct({ ...updatedProduct, image: e.target.value })
              }
            />
          </VStack>
  
          <HStack spacing={4} mt={6}>
            <Button
              colorScheme="green"
              onClick={() => handleUpdateProduct(product._id, updatedProduct)}
            >
              Confirm
            </Button>
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
          </HStack>
        </Modal>
      </Box>
    );
  };
  
  export default ProductCard;
  