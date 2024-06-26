import React, { useEffect, useState } from 'react'
import Navbar from '../Components/AllProduct/Navbar.js'
import Products from '../Components/Products'
import Footer from '../Components/Shared/Footer'
import dbService from '../services/services.js'
import { useParams } from 'react-router-dom'

function AllProducts() {
  const [products, setProducts] = useState([])
  const [skipProducts, setSkipProducts] = useState(0)
  const [searchTerm, setSearchTerm] = useState('')
  const [minprice, setMinPrice] = useState(0)
  const [maxprice, setMaxPrice] = useState(0)
  const [selectedStores, setSelectedStores] = useState([])
  const params = useParams()

  let productsInPage = 15

  async function searchProducts(query) {
    console.log('search products called...')
    if (parseInt(minprice) > parseInt(maxprice)) {
      alert('Please enter a valid price range.')
      return
    }
    if (query == undefined) {
      query = params.query
    }
    setSearchTerm(query)
    // setMinPrice(0)
    // setMaxPrice(0)
    //commit

    const products = await dbService.getAllProducts(
      query,
      productsInPage,
      skipProducts,
      maxprice,
      minprice,
      selectedStores
    )
    setProducts(products)
  }

  useEffect(() => {
    searchProducts()
    // fetchProducts()
  }, [])

  async function fetchProducts() {
    console.log('fetch products called...')
    const fetchedProducts = await dbService.getAllProducts('', 15, 0, 0, 0, [])
    setProducts(fetchedProducts)
  }

  const handleNextPage = () => {
    console.log('working...')
    setSkipProducts(skipProducts + productsInPage)
    searchProducts(searchTerm)
  }

  const handlePreviousPage = () => {
    if (skipProducts >= productsInPage) {
      setSkipProducts(skipProducts - productsInPage)
      searchProducts(searchTerm)
    }
  }

  return (
    <div>
      <Navbar
        searchActionHandler={searchProducts}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />

      <Products
        doesShow={false}
        products={products}
        setMaxPrice={setMaxPrice}
        setMinPrice={setMinPrice}
        maxPrice={maxprice}
        minPrice={minprice}
        setSelectedStores={setSelectedStores}
        selectedStores={selectedStores}
        handleSearch={searchProducts}
        searchTerm={searchTerm}
      />

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          margin: '20px ',
        }}
      >
        <button
          onClick={handlePreviousPage}
          disabled={skipProducts === 0}
          className='btn btn-primary'
        >
          Previous
        </button>
        <button onClick={handleNextPage} className='btn btn-primary'>
          Next
        </button>
      </div>
      <Footer />
    </div>
  )
}

export default AllProducts
