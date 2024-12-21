import React, { useState } from "react";
import { Box, Button, Container, Heading, Input, VStack } from "@chakra-ui/react";
import { toast } from 'react-toastify'
import { useProductstore } from "../store/product.js";

const CreatePage = () => {
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    stock: "",
    image: "",
    description: "",
  });

  const { createProduct } = useProductstore();

  const handleAddProduct = async () => {
    const { success, message } = await createProduct(newProduct);

    if (success) {
			toast.success("Product added successfully!");
		} else {
      toast.error(message);
		}
    setNewProduct({ name: "", price: "", stock: "", image: null, description: "" });
  };

  return (
    <Container maxW={"container.sm"}>
      <VStack spacing={8}>
        <Heading as={"h1"} size={"2xl"} textAlign={"center"} mb={8}>
          Add Product
        </Heading>

        <Box
          w={"full"}
          bg={"white"}
          p={6}
          rounded={"lg"}
          shadow={"md"}
        >
          <VStack spacing={4}>
            <Input
              placeholder="Product Name *"
              name="name"
              value={newProduct.name}
              onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
              required 
            />
            <Input
              placeholder="Describe Product *"
              name="description"
              value={newProduct.description}
              onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
              required 
            />
            <Input
              placeholder="Price *"
              name="price"
              type="number"
              value={newProduct.price}
              onChange={(e) => setNewProduct({ ...newProduct, price: Number(e.target.value) })}
              required 
            />
            <Input
              placeholder="Stock  *"
              name="stock"
              type="number"
              value={newProduct.stock}
              onChange={(e) => setNewProduct({ ...newProduct, stock: Number(e.target.value) })}
              required 
            />
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files[0];
                setNewProduct((prev) => ({ ...prev, image: file }));
              }}
              required 
            />
            <Button colorPalette={"green"} onClick={handleAddProduct} w={"full"}>
              Add Product
            </Button>
          </VStack>
        </Box>
      </VStack>
      

    </Container>
  );
};

export default CreatePage;
