import React from 'react'
import PostContext from '../context/post/postContext';

export default function Example() {
    const { post, setPost, setImg, addPost } = React.useContext(PostContext);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPost({ ...post, [name]: value, });
    };
    const handleImage = (e) => {
        setImg(e.target.files[0])
    }

    const submitPost = async (e) => {
        e.preventDefault()
        addPost()
    }


    return (
        <form onSubmit={submitPost} encType='multipart/formdata' className="flex-col flex-1 " style={{ overflowY: "auto", height: "100vh", background : "#e4fff0"}} >
            {/* component */}

            <section className=" py-1">
                <div className="w-4/6 px-4 mx-auto mt-6">
                    <div className=" border-green-950 border-2 relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-white ">
                        <div className="rounded-t bg-lime-400 mb-0 px-6 py-6">
                            <div className="text-center flex justify-between">
                                <h6 className="text-black text-3xl font-extrabold">Create Post</h6>

                                <button
                                    className="bg-green-950 hover:bg-green-400 text-white active:bg-pink-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 ease-linear transition-all duration-150"
                                    type="submit"
                                >
                                    Post
                                </button>
                            </div>
                        </div>
                        <div className="flex-auto px-4 lg:px-10 py-10 pt-0 bg-lime-400">
                        <div className="h-[2px] bg-gray-800 w-full my-4"></div>
                            <div>
                                <h6 className="text-black text-sm mt-3 mb-6 font-extrabold uppercase">
                                    Post Information
                                </h6>
                                <div className="flex flex-wrap">
                                    <div className="w-full lg:w-12/12 px-4">
                                        <div className="relative w-full mb-3">
                                            <label
                                                className="block uppercase text-gray-900 text-xs font-bold mb-2"
                                                htmlFor="grid-password"
                                            >
                                                Post Title
                                            </label>
                                            <input
                                                onChange={handleChange} type="text" name='postTitle'
                                                value={post.postTitle}
                                                className="border-2 px-3 py-3 placeholder-gray-500 border-black text-gray-900 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                                                placeholder='Post Title'
                                            />
                                        </div>
                                    </div>
                                    <div className="w-full lg:w-12/12 px-4">
                                        <div className="relative w-full mb-3">
                                            <label
                                                className="block uppercase text-gray-900 text-xs font-bold mb-2"
                                                htmlFor="grid-password"
                                            >
                                                Post Description
                                            </label>
                                            <textarea
                                                onChange={handleChange} type="text" name='postDescription'
                                                value={post.postDescription}
                                                className="border-2 px-3 py-3 placeholder-gray-500 border-black text-gray-900 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                                                rows={4}
                                                placeholder='Post Description'
                                            />
                                        </div>
                                    </div>
                                </div>
                                <hr className="mt-6 border-b-1 border-blueGray-300" />
                                <h6 className="text-gray-900 text-sm mt-3 mb-6 font-extrabold uppercase">
                                    Product Information
                                </h6>
                                <div className="flex flex-wrap">
                                    <div className="w-full lg:w-6/12 px-4">
                                        <div className="relative w-full mb-3">
                                            <label
                                                className="block uppercase text-gray-900 text-xs font-bold mb-2"
                                                htmlFor="grid-password"
                                            >
                                                Product Name
                                            </label>
                                            <input
                                                onChange={handleChange} type="text" name='productName'
                                                value={post.productName}
                                                className="border-2 px-3 py-3 placeholder-gray-500 border-black text-gray-900 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                                                placeholder='Product Name'
                                            />
                                        </div>
                                    </div>
                                    <div className="w-full lg:w-6/12 px-4">
                                        <div className="relative w-full mb-3">
                                            <label
                                                className="block uppercase text-gray-900 text-xs font-bold mb-2"
                                                htmlFor="grid-password"
                                            >
                                                Product Category
                                            </label>
                                            <select onChange={handleChange} value={post.category} className="border-2 px-3 py-3 placeholder-gray-500 border-black text-gray-900 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                                                name='category' id="">
                                                <option defaultValue="Others">Others</option>
                                                <option value="Fruits">Fruits</option>
                                                <option value="Vegetables">Vegetables</option>
                                                <option value="Livestock">Livestock</option>
                                                <option value="Seeds">Seeds</option>
                                                <option value="Grains">Grains</option>
                                                <option value="Dairy">Dairy</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="w-full lg:w-6/12 px-4">
                                        <div className="relative w-full mb-3">
                                            <label
                                                className="block uppercase text-gray-900 text-xs font-bold mb-2"
                                                htmlFor="grid-password"
                                            >
                                                Product Variety
                                            </label>
                                            <input
                                                onChange={handleChange} type="text" name='variety'
                                                value={post.variety}
                                                className="border-2 px-3 py-3 placeholder-gray-500 border-black text-gray-900 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                                                placeholder='Product Variety'
                                            />
                                        </div>
                                    </div>
                                    <div className="w-full lg:w-6/12 px-4">
                                        <div className="relative w-full mb-3">
                                            <label
                                                className="block uppercase text-gray-900 text-xs font-bold mb-2"
                                                htmlFor="grid-password"
                                            >
                                                Product Grade
                                            </label>
                                            <input
                                                onChange={handleChange} type="text" name='grade'
                                                value={post.grade}
                                                className="border-2 px-3 py-3 placeholder-gray-500 border-black text-gray-900 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                                                placeholder='Product Grade'
                                            />
                                        </div>
                                    </div>
                                    <div className="w-full lg:w-6/12 px-4">
                                        <div className="relative w-full mb-3">
                                            <label
                                                className="block uppercase text-gray-900 text-xs font-bold mb-2"
                                                htmlFor="grid-password"
                                            >
                                                Product Harvest Date
                                            </label>
                                            <input
                                                onChange={handleChange} type="date" name='harvestDate'
                                                value={post.harvestDate}
                                                className="border-2 px-3 py-3 placeholder-gray-500 border-black text-gray-900 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                                                placeholder='Product Harvest Date'
                                            />
                                        </div>
                                    </div>
                                    <div className="w-full lg:w-6/12 px-4">
                                        <div className="relative w-full mb-3">
                                            <label
                                                className="block uppercase text-gray-900 text-xs font-bold mb-2"
                                                htmlFor="grid-password"
                                            >
                                                Product Shelf Life
                                            </label>
                                            <input
                                                onChange={handleChange} type="text" name='shelfLife'
                                                value={post.shelfLife}
                                                className="border-2 px-3 py-3 placeholder-gray-500 border-black text-gray-900 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                                                placeholder='Product Shelf Life'
                                            />
                                        </div>
                                    </div>
                                </div>
                                <hr className="mt-6 border-b-1 border-blueGray-300" />
                                <h6 className="text-gray-900 text-sm mt-3 mb-6 font-bold uppercase">
                                    Product Quantity and Price
                                </h6>
                                <div className="flex flex-wrap">
                                    <div className="w-full lg:w-6/12 px-4">
                                        <div className="relative w-full mb-3">
                                            <label
                                                className="block uppercase text-gray-900 text-xs font-bold mb-2"
                                                htmlFor="grid-password"
                                            >
                                                Product Quantity
                                            </label>
                                            <input
                                                onChange={handleChange} type="Number" name='quantity'
                                                value={post.quantity}
                                                className="border-2 px-3 py-3 placeholder-gray-500 border-black text-gray-900 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                                                placeholder='Product Quantity'
                                            />
                                        </div>
                                    </div>
                                    <div className="w-full lg:w-6/12 px-4">
                                        <div className="relative w-full mb-3">
                                            <label
                                                className="block uppercase text-gray-900 text-xs font-bold mb-2"
                                                htmlFor="grid-password"
                                            >
                                                Quantity Unit
                                            </label>
                                            <select onChange={handleChange} value={post.unit} className="border-2 px-3 py-3 placeholder-gray-500 border-black text-gray-900 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                                                name="unit" id="">
                                                <option defaultValue="kg">kg</option>
                                                <option value="lbs">lbs</option>
                                                <option value="crates">crates</option>
                                                <option value="liters">liters</option>
                                                <option value="units">units</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="w-full lg:w-6/12 px-4">
                                        <div className="relative w-full mb-3">
                                            <label
                                                className="block uppercase text-gray-900 text-xs font-bold mb-2"
                                                htmlFor="grid-password"
                                            >
                                                Price per Unit
                                            </label>
                                            <input
                                                onChange={handleChange} type="number" name='pricePerUnit'
                                                value={post.pricePerUnit}
                                                className="border-2 px-3 py-3 placeholder-gray-500 border-black text-gray-900 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                                                placeholder='Price per Units'
                                            />
                                        </div>
                                    </div>
                                    <div className="w-full lg:w-6/12 px-4">
                                        <div className="relative w-full mb-3">
                                            <label
                                                className="block uppercase text-gray-900 text-xs font-bold mb-2"
                                                htmlFor="grid-password"
                                            >
                                                Pricing Type
                                            </label>
                                            <select onChange={handleChange} value={post.pricingType} className="border-2 px-3 py-3 placeholder-gray-500 border-black text-gray-900 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                                                name="pricingType" id="">
                                                <option defaultValue="Fixed">Fixed</option>
                                                <option value="Negotiable">Negotiable</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <hr className="mt-6 border-b-1 border-blueGray-300" />
                                <h6 className="text-gray-900 text-sm mt-3 mb-6 font-bold uppercase">
                                    Upload Images
                                </h6>
                                <div>
                                    <div>
                                        <label htmlFor="file-input" className="sr-only">Choose file</label>
                                        <input onChange={handleImage} type="file" name="image" id="image" className="block w-full border border-gray-200 shadow-sm rounded-lg text-sm focus:z-10 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-indigo-900 dark:border-neutral-700 400 file:bg-gray-50 file:border-2 file:me-4 file:py-3 file:px-4 dark:file:bg-indigo-500 dark:file:text-white" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </section>
        </form>
    )
}
