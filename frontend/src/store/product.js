import { create } from "zustand";
import { useAuthStore } from "./auth";
const base = import.meta.env.base_port;
export const useProductstore = create((set) => ({
  products: [],
	setProducts: (products) => set({ products }),
	createProduct: async (newProduct) => {
		if (!newProduct.name || !newProduct.image || !newProduct.price) {
			return { success: false, message: "Please fill in all fields." };
		}

		const { user } = useAuthStore.getState();

		const formData = new FormData();
		formData.append('name', newProduct.name);
		formData.append('price', newProduct.price);
		formData.append('stock', newProduct.stock);
		formData.append('description', newProduct.description);
		formData.append('image', newProduct.image);

		const res = await fetch(`${base}/api/products`, {
			method: "POST",
			headers: {
				Authorization: `Bearer ${user.token}`,
			},
			body: formData,
		});
		const data = await res.json();
		set((state) => ({ products: [...state.products, data.data] }));
		return { success: true, message: "Product created successfully" };
	},
	fetchProducts: async () => {
		try {
			const res = await fetch(`${base}/api/products`);
			const text = await res.json();  
			// console.log("Raw response:", text);
		
			// const data = JSON.parse(text);  
		
			if (!res.ok) {
			  throw new Error(data.message || 'Failed to fetch products');
			}
		
			set({ products: text.data || [] });
		} catch (error) {
			console.log('Error fetching products:', error);
			set({ products: [] });
		}
  },
   deleteProduct: async (Product_id) =>{
	const { user } = useAuthStore.getState();
	const res = await fetch(`${base}/api/products/${Product_id}`, {
		method: "DELETE",
		headers: {
			Authorization: `Bearer ${user.token}`,
		},
	}); 
	const data = await res.json();
	// console.log("data",data);
	if (!data.success) return { success: false, message: data.message };
	set((state) => ({ products: state.products.filter((product) => product._id !== Product_id) }));
	return { success: true, message: data.message };
   },
   updateProduct: async (productID, up) => {
	const updatedProduct = JSON.stringify(up);
    const { user } = useAuthStore.getState();
	console.log(`object ${updatedProduct}`);
	
    const res = await fetch(`${base}/api/products/${productID}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
      body: updatedProduct
    });


    const data = await res.json();
    if(!data.success) return { success: false , message: data.message };
    set( (state) => ({
      products: state.products.map( (product) => (product._id === productID ? data.data : product)),
    }));

    return {success: true , message: data.message}; 

  }
})); 