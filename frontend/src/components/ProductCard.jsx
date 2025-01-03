import { Box, Button, Heading, HStack, VStack, Image, Text, Input } from "@chakra-ui/react";
import React, { useState } from "react";
import Modal from "react-modal";
import { modalCustomStyles } from "../styles/modalStyles";
import { useNavigate } from 'react-router-dom';
import { useProductstore } from "../store/product";
import { useCartStore } from "../store/cart.js"; 
import { toast } from "react-toastify";
import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import { useAuthStore } from "../store/auth"; 
import { Link } from "react-router-dom";
const base = import.meta.env.base_port;
Modal.setAppElement("#root");

const ProductCard = (prod) => {
  const { product } = prod
  const [updatedProduct, setUpdatedProduct] = useState(product);
  const [isOpen, setIsOpen] = useState(false);


  const { updateProduct, deleteProduct } = useProductstore();
  const { addToCart } = useCartStore(); 
  const { user } = useAuthStore(); 
  const navigate = useNavigate();
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
      }v 
    } catch (error) {
      console.error("Error updating product:", error);
      toast.error("An unexpected error occurred.");
    } finally {
      setIsOpen(false);
    }
  };

  const handleAddToCart = async () => {
    if(!user){
      navigate("/login");
    }else if (user.username === product.owner){ 
      toast.error("you cant buy your own product");
      return;
    }else{
      try {
        await addToCart(product._id, 1);
        toast.success("Product added to cart!");
      } catch (error) {
        toast.error("Failed to add product to cart.");
      }
    }
  };

  return (
    <Box
      shadow="lg"
      rounded="lg"
      overflow="hidden"
      transition="all 0.3s"
      _hover={{ transform: "translateY(-5px)", shadow: "xl" }}
      bg={"teal.200"}
    >
        <Image
          src={`${base}/uploads/${product.image}`}
          alt={product.name}
          h={48}
          w="full"
          objectFit="cover"
          onClick={() => navigate(`/product/${product._id}`)}
          cursor="pointer"
        />
      <Box p={4}>
        <Heading as="h3" size="md" mb={2}>
          <Link to={`/product/${product._id}`}>
            {product.name}
          </Link>
        </Heading>

        <Text fontWeight="bold" fontSize="xl" color={"gray.600"} mb={4}>
          ${product.price}
        </Text>

        <HStack spacing={2}>
          <Button colorPalette="orange" color={"gray.800"} variant="subtle" onClick={handleAddToCart}>
            Add to Cart
          </Button>

          {user && (user.role === "admin" || user.username === product.owner) && (
            <>
              <Button color="cyan.500" variant="solid" onClick={() => setIsOpen(true)}>
                <EditIcon fontSize={15} />
              </Button>
              <Button color="red.500" variant="solid" onClick={() => handleDeleteProduct(product._id)}>
                <DeleteIcon fontSize={15} />
              </Button>
            </>
          )}
        </HStack>
      </Box>

      <Modal isOpen={isOpen} onRequestClose={() => setIsOpen(false)} style={modalCustomStyles}>
        <Heading size="md" mb={4}>
          Edit Product
        </Heading>
        <VStack spacing={4}>
          <Text mb={1}>Product name</Text>
          <Input
            placeholder="Product Name"
            name="name"
            value={updatedProduct.name}
            onChange={(e) => setUpdatedProduct({ ...updatedProduct, name: e.target.value })}
            required 
          />
          <Text mb={1}>Price</Text>
          <Input
            placeholder="Price"
            name="price"
            type="number"
            value={updatedProduct.price}
            onChange={(e) => setUpdatedProduct({ ...updatedProduct, price: e.target.value })}
            required 
          />
        </VStack>

        <HStack spacing={4} mt={6}>
          <Button colorPalette="cyan" onClick={() => handleUpdateProduct(product._id, updatedProduct)}>
            Confirm
          </Button>
          <Button colorPalette="red" variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
        </HStack>
      </Modal>
    </Box>
  );
};

export default ProductCard;
