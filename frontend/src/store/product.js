import { create } from "zustand";

export const useProductstore = create((set) => ({
  products: [],
	setProducts: (products) => set({ products }),
	createProduct: async (newProduct) => {
		if (!newProduct.name || !newProduct.image || !newProduct.price) {
			return { success: false, message: "Please fill in all fields." };
		}
		const res = await fetch("/api/products", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(newProduct),
		});
		const data = await res.json();
		set((state) => ({ products: [...state.products, data.data] }));
		return { success: true, message: "Product created successfully" };
	},
	fetchProducts: async () => {
		try {
			const res = await fetch('/api/products');
			const text = await res.text();  
			// console.log("Raw response:", text);
		
			const data = JSON.parse(text);  // Parse the raw text as JSON
		
			if (!res.ok) {
			  throw new Error(data.message || 'Failed to fetch products');
			}
		
			set({ products: data.data || [] });
		} catch (error) {
			console.error('Error fetching products:', error);
			set({ products: [] });
		}
  },
   deleteProduct: async (Product_id) =>{
	const res = await fetch(`/api/products/${Product_id}`, {
		method: "DELETE",
	}); 
	const data = await res.json();
	// console.log("data",data);
	if (!data.success) return { success: false, message: data.message };
	set((state) => ({ products: state.products.filter((product) => product._id !== Product_id) }));
	return { success: true, message: data.message };
   },
   updateProduct: async (productID,updatedProduct) => {
	const res = await fetch(`/api/products/${productID}`, {
		method: "PUT",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(updatedProduct),
	});
	const data = await res.json();
	if(!data.success) return { success: false , message: data.message };
	set( (state) => ({
		products: state.products.map( (product) => (product._id === productID ? data.data : product)),
	}));

	return {success: true , message: data.message}; 
   }
})); 