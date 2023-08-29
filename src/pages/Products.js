import React, { useEffect, useState } from 'react'
import { Col, Skeleton, Row, Select, Button, Empty } from 'antd'
import { Link } from 'react-router-dom'
import InfiniteScroll from 'react-infinite-scroll-component'
import cn from 'classnames'
import instance from '../utils/axios'
import PageTitle from '../components/PageTitle'
import { Box, Back, Filter } from 'iconsax-react'
import Card from '../components/Product/Card'

const ProductsPage = () => {
  const [productCodes, setProductCodes] = useState([])
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [subcategories, setSubcategories] = useState([])
  const [categoryStack, setCategoryStack] = useState([])
  const [selectedCategory, setSelectedCategory] = useState()
  const [filterOptions, setFilterOption] = useState([])
  const [selectedFilters, setSelectedFilters] = useState([])
  const [selectedOptions, setSelectedOptions] = useState([])
  const [showFilter, setShowFilter] = useState(false)
  const [load, setLoad] = useState(false)
  const [page, setPage] = useState(0)
  const [noData, setNoData] = useState(false)
  useEffect(() => {
    instance.post('/top_categories').then((res) => {
      setCategories(res.data)
      setSelectedCategory(res.data[0])
    })
  }, [])

  useEffect(() => {
    if (selectedCategory?.id) {
      setLoad(false)
      instance
        .post(
          '/products_by_category_with_filter?CategoryId=' + selectedCategory.id,
          {
            selectedFilters: selectedFilters,
          }
        )
        .then((res) => {
          if (res.data.length === 0) {
            setNoData(true)
            console.log('asd')
          } else {
            setProducts([])
            setNoData(false)
            setProductCodes(res.data.map((item) => item.code))
            setPage(1)
          }
        })
      instance
        .post('/filter_with_category?CategoryId=' + selectedCategory.id)
        .then((data) => {
          setFilterOption(data.data)
        })
    }
  }, [selectedCategory, selectedFilters])
  useEffect(() => {
    if (productCodes.length > 0 && page > 0) {
      instance
        .post('/products_details_by_codes', {
          productCodes: productCodes.slice(products.length, page * 6),
        })
        .then((res) => {
          setProducts((prevProducts) => [...prevProducts, ...res.data])
          setLoad(true)
        })
    } else {
      setLoad(true)
    }
  }, [productCodes, page])

  const handleCategoryClick = (category) => {
    instance
      .post('/category_with_top_category?CategoryId=' + category.id)
      .then((data) => {
        setSelectedCategory(category)
        setSubcategories(data.data)
        setCategoryStack((prevStack) => [...prevStack, category])
      })
  }

  const handleSubcategoryClick = (category) => {
    handleCategoryClick(category)
  }

  const handleGoBack = () => {
    if (categoryStack.length > 0) {
      setSubcategories([])
      const newStack = [...categoryStack]
      newStack.pop() // Pop from category stack
      const previousCategoryId = newStack[newStack.length - 1]?.id
      setCategoryStack(newStack)

      // Fetch and set previous subcategories
      if (previousCategoryId !== undefined) {
        instance
          .post(
            '/category_with_top_category?CategoryId=' + previousCategoryId,
            {
              selectedFilters: [],
            }
          )
          .then((data) => {
            setSubcategories(data.data)
          })
      }
    }
  }
  const optionsToKeyValues = (options) => {
    let returnArray = [{ label: 'Seçiniz', value: '' }]
    options.forEach((option) => {
      let keyValue = { label: option, value: option }
      returnArray.push(keyValue)
    })
    return returnArray
  }

  const handleOptionChange = (mainKey, subKey, selectedValue) => {
    if (selectedValue === '') {
      const updatedSelectedOptions = selectedOptions.filter(
        (option) => !(option.mainKey === mainKey && option.subKey === subKey)
      )
      setSelectedOptions(updatedSelectedOptions)
    } else {
      const updatedSelectedOptions = [...selectedOptions]
      const existingIndex = updatedSelectedOptions.findIndex(
        (item) => item.mainKey === mainKey && item.subKey === subKey
      )

      if (existingIndex !== -1) {
        updatedSelectedOptions[existingIndex].selectedOptions = [selectedValue]
      } else {
        updatedSelectedOptions.push({
          mainKey,
          subKey,
          selectedOptions: [selectedValue],
        })
      }

      setSelectedOptions(updatedSelectedOptions)
    }
  }

  return (
    <div className=''>
      <PageTitle
        title='Ürünler'
        icon={<Box color='#8E92BC' />}
        action={
          <Button
            shape='circle'
            icon={<Filter color='#8E92BC' />}
            onClick={() => setShowFilter(!showFilter)}
          />
        }
      />
      <Row
        gutter={{
          xs: 8,
          sm: 16,
          md: 24,
          lg: 32,
        }}
        className='px-4'
      >
        <Col className='gutter-row ' span={6}>
          <div className=' bg-white rounded-lg p-8'>
            <h1 className='text-xl  text-gray-500 pb-1 border-b-2 border-primary flex items-center gap-2 mb-5'>
              <Box color='#8E92BC' />
              Ev Aletleri
            </h1>
            <div>
              {load ? (
                <div>
                  {categoryStack.length > 0 && (
                    <button
                      className='border p-2 w-full bg-primary rounded-lg mb-3 text-white flex items-center justify-center gap-3'
                      onClick={handleGoBack}
                    >
                      <Back /> Listeye Geri Dön
                    </button>
                  )}

                  <ul>
                    {categoryStack.length === 0
                      ? categories.map((category) => (
                          <li
                            key={category.id}
                            onClick={() => handleCategoryClick(category)}
                            className='p-2 border border-gray-200 mb-2  rounded-lg hover:bg-primary hover:text-white transition-all cursor-pointer'
                          >
                            {category.name}
                          </li>
                        ))
                      : subcategories.map((subcategory) => (
                          <li
                            key={subcategory.id}
                            onClick={() => handleSubcategoryClick(subcategory)}
                            className='p-2 border border-gray-200 mb-2  rounded-lg hover:bg-primary hover:text-white transition-all cursor-pointer'
                          >
                            {subcategory.name}
                          </li>
                        ))}
                  </ul>
                </div>
              ) : (
                <Skeleton />
              )}
            </div>
          </div>
        </Col>
        <Col className='gutter-row ' span={18}>
          <div className='relative'>
            <div
              className={cn(
                'p-6 bg-white rounded-lg mb-10  right-0 w-full shadow-2xl',
                showFilter ? 'block' : 'hidden'
              )}
            >
              <h3 className='text-lg font-bold text-primary mb-10'>Filtre</h3>
              <div className='flex items-center  gap-3 mb-10'>
                {filterOptions.length ? (
                  filterOptions.map((i) => (
                    <div className='w-full'>
                      <span className='text-sm text-gray-500  font-bold mb-2 block'>
                        {i.name}
                      </span>
                      <Select
                        value={
                          selectedOptions.find(
                            (option) =>
                              option.mainKey === i.mainKey &&
                              option.subKey === i.subKey
                          )?.selectedOptions[0] || ''
                        }
                        size='large'
                        style={{
                          width: '100%',
                        }}
                        onChange={(e) =>
                          handleOptionChange(i.mainKey, i.subKey, e)
                        }
                        options={optionsToKeyValues(i.filterOptions)}
                      />
                    </div>
                  ))
                ) : (
                  <Empty
                    className='mx-auto'
                    description={
                      'Bu ürün kategorisine ait filtreleme buluanamdı'
                    }
                  />
                )}
              </div>
              {filterOptions.length ? (
                <div className='flex items-center justify-end gap-3'>
                  <Button
                    type='primary'
                    danger
                    onClick={() => {
                      setSelectedFilters([])
                      setSelectedOptions([])
                    }}
                  >
                    Temizle
                  </Button>
                  <Button
                    type='primary'
                    onClick={() => setSelectedFilters(selectedOptions)}
                  >
                    Filtrele
                  </Button>
                </div>
              ) : (
                ''
              )}
            </div>
            <h1 className='text-xl font-bold text-primary mb-6'>
              Popüler Ürünler
            </h1>
            {noData && !load ? (
              <Empty
                className='mx-auto w-full'
                description={'Bu ürün kategorisine ait ürün buluanamdı'}
              />
            ) : (
              <InfiniteScroll
                dataLength={3}
                // next={() => setPage(page + 1)}
                hasMore={false}
                loader={<Skeleton />}
              >
                <div className='flex flex-wrap'>
                  {products.slice(0, 3).map((item) => (
                    <div
                      className=' xl:w-1/3 lg:w-1/2 md:full sm:w-full p-1'
                      span={18}
                    >
                      <Card
                        img={item.instoreAppStandartImage.defaultUrl}
                        title={item.name}
                        item={item}
                        populer
                      />
                    </div>
                  ))}
                </div>
              </InfiniteScroll>
            )}
            <h1 className='text-xl font-bold text-primary mb-6'>
              {selectedCategory?.name}
            </h1>
            {noData && !load ? (
              <Empty
                className='mx-auto w-full'
                description={'Bu ürün kategorisine ait ürün buluanamdı'}
              />
            ) : (
              <InfiniteScroll
                dataLength={products.length}
                next={() => setPage(page + 1)}
                hasMore={productCodes.length > products.length}
                loader={<Skeleton />}
              >
                <div className='flex flex-wrap'>
                  {products.map((item) => (
                    <div
                      className=' xl:w-1/3 lg:w-1/2 md:full sm:w-full p-1'
                      span={18}
                    >
                      <Card
                        img={item.instoreAppStandartImage.defaultUrl}
                        title={item.name}
                        item={item}
                      />
                    </div>
                  ))}
                </div>
              </InfiniteScroll>
            )}
          </div>
        </Col>
      </Row>
      <div></div>
    </div>
  )
}

export default ProductsPage
