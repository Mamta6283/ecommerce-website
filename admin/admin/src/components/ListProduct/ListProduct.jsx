import React, { useEffect, useState } from "react";
import "./ListProduct.css";
import cross_icon from "../../assets/cross_icon.png";

function ListProduct(props) {
  const [allproducts, setAllProducts] = useState([]);

  //  const fetchInfo=async()=>{
  //     await fetch('http://localhost:4000/allproduct')
  //     .then((res)=> res.json())
  //     .then((data)=>{
  //         setAllProducts(data)
  //     })
  //  }

  const fetchInfo = async () => {
    try {
      const response = await fetch("http://localhost:4000/allproducts");
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setAllProducts(data,"here details of product");
    } catch (error) {
      console.error("There was a problem fetching the product data:", error);
    }
  };

  useEffect(() => {
    fetchInfo();
  }, []);

  const remove_product = async (id) => {
    await fetch("http://localhost:4000/removeproduct", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: id }),
    });
    await fetchInfo();
  };
  
  return (
    <div className="list-product">
      <h1>All Products List</h1>
      <div className="listproduct-format-main">
        <p>Products</p>
        <p>Title</p>
        <p>Old Price</p>
        <p>New Price</p>
        <p>Category</p>
        <p>Remove</p>
      </div>
      <div className="listproduct-allproducts">
        <hr />
        {allproducts.map((products, index) => {
          return (
            <>
              <div key={index} className="listproduct-format-main listproduct-format" >
               
                <img src={products.image} alt="" className="list-product-icon" />

                <p>{products.name}</p>
                <p>${products.old_price}</p>
                <p>${products.new_price}</p>
                <p>{products.category}</p>
                <img
                  src={cross_icon}
                  alt=""
                  className="listproduct-remove-icon"
                  onClick={() => {
                    remove_product(products.id);
                  }}
                />
              </div>
              <hr />
            </>
          );
        })}
      </div>
    </div>
  );
}

export default ListProduct;
