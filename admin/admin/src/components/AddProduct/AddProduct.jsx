import React, { useState } from 'react';
import './AddProduct.css'
import upload_area from '../../assets/upload_area.svg'

function AddProduct(props) {
    const [image,setImage]=useState(false)
    const[productDetails,setProductDetails]=useState({
        name:"",
        image:"",
        category:"women",
        new_price:"",
        old_price:""
    })

    const imageHandler=(e)=>{
            setImage(e.target.files[0])
    }

    const changeHandler=(e)=>{
        setProductDetails({...productDetails,[e.target.name]:e.target.value})
    }
//     const Add_Product=async()=>{
//         console.log(productDetails);
//         let responseData;
//         let product=productDetails;

//         let formData=new FormData()
//         // formData.append('product',image);
//         formData.append('image', image); // Fix name if the backend expects 'image' instead of 'product'
//         formData.append('name', productDetails.name);
//         formData.append('category', productDetails.category);
//         formData.append('new_price', productDetails.new_price);
// formData.append('old_price', productDetails.old_price);

         
//         await fetch(`http://localhost:4000/upload`,{
//             method:'POST',
//             headers:{
//                 Accept:'application/json',
//             },
//             body:formData,
//             }).then((res)=>res.json())
//             .then((data)=>{

//                 responseData=data;
//             })
//         if(responseData.success)
//         {
//             product.image=responseData.image_url;
//             console.log(product)
//             await fetch('http://localhost:4000/addproduct',{
//                 method:"POST",
//                 headers:{
//                     Accept:"application/json",
//                     'Content-type':"application/json"
//                 },
//                 body:JSON.stringify(product)
//             }).then((res)=> res.json())
//             .then((data)=>{
//                data.success?alert("product Added"):alert("failed")
//             })
//         }
//     }

// const Add_Product = async () => {
//     try {
//         let responseData;
//         let formData = new FormData();

//         // Append image and other product details
//         formData.append('image', image);
//         formData.append('name', productDetails.name);
//         formData.append('category', productDetails.category);
//         formData.append('new_price', productDetails.new_price);
//         formData.append('old_price', productDetails.old_price);

//         // Upload image
//         const uploadResponse = await fetch('http://localhost:4000/upload', {
//             method: 'POST',
//             headers: {
//                 Accept: 'application/json',
//             },
//             body: formData,
//         });
// console.log(uploadResponse)
//         const data = await uploadResponse.json();

//         if (data.success) {
//             const product = { ...productDetails, image: data.image_url };

//             // Add product
//             const productResponse = await fetch('http://localhost:4000/addproduct', {
//                 method: "POST",
//                 headers: {
//                     Accept: "application/json",
//                     'Content-type': "application/json"
//                 },
//                 body: JSON.stringify(product)
//             });

//             const productData = await productResponse.json();
//             productData.success ? alert("Product Added") : alert("Failed to add product");
//         } else {
//             alert("Image upload failed");
//         }
//     } catch (error) {
//         console.error("Error adding product:", error);
//         alert("Something went wrong");
//     }
// };

const Add_Product = async () => {
    console.log(productDetails,"product details in add-product.jsx")

    try { 

        let responseData;
        let product=productDetails;
        console.log(product,"here we are sending value of productdetails")

        let formData = new FormData();
        formData.append('image', image);
        formData.append('name', productDetails.name);
        formData.append('category', productDetails.category);
        formData.append('new_price', productDetails.new_price);
        formData.append('old_price', productDetails.old_price);
        for (let [key, value] of formData.entries()) {
            console.log(key, value);
        }
        // Uploads image
        const uploadResponse = await fetch('http://localhost:4000/uploads', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
            },
            body: formData,
        });

       
        if (!uploadResponse.ok) {
            throw new Error(`Image upload failed: ${uploadResponse.statusText}`);
        }

        const data = await uploadResponse.json();
        console.log(data,"data after upload api")

        if (data.success) {
            const product = { ...productDetails, image: data.image_url };
            console.log(product,"product in add product")
            // Add product
            const productResponse = await fetch('http://localhost:4000/addproduct', {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    'Content-Type': "application/json"
                },
                body: JSON.stringify(product)
            });

            if (!productResponse.ok) {
                throw new Error(`Product addition failed: ${productResponse.statusText}`);
            }

            const productData = await productResponse.json();
            console.log(productData)
            productData.success ? alert("Failed to add product") : alert("product added");
        } else {
            alert("Image upload failed");
        }
    } catch (error) {
        console.error("Error adding product:", error);
        alert(`Something went wrong: ${error.message}`);
    }
};

    return (

        <div className='add-product'>

            <div className="addproduct-itemfield">
                <p>Product Title</p>  
                <input type="text" name='name' placeholder='type here' value={productDetails.name} onChange={changeHandler} />
            </div>  
            
               <div className="addproduct-price">
                <div className="addproduct-itemfield ">
                    <p>Price</p>
                    <input value={productDetails.old_price} onChange={changeHandler} type="text" name='old_price' placeholder='type here' />
                </div>
                <div className="addproduct-itemfield">
                    <p>Offer Price</p>
                    <input value={productDetails.new_price} onChange={changeHandler} type="text" name='new_price' placeholder='type here' />
                </div>

               </div> 
               <div className="addproduct-itemfield">
                <p>Product Category</p>
                <select value={productDetails.category} onChange={changeHandler} name="category" className='addproduct-selector'>
                    <option value="women">  women</option>
                    <option value="men">men</option>
                    <option value="kid">kid</option>
                </select>
               </div>
            <div className="addproduct-itemfield">
                <label htmlFor="file-input">
                    <img src={ image? URL.createObjectURL(image):upload_area} alt=""  className='addproduct-thumnail-img' name="image"/>
                </label>
                <input type="file" name='image' id='file-input' onChange={imageHandler} hidden /><br></br>
                <button className='addproduct-btn' onClick={()=>{Add_Product()}} >ADD</button>
            </div>
        </div>
    );
}

export default AddProduct;