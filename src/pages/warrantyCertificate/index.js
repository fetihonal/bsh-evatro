import React, { useState, useEffect } from 'react'
import {
  Col,
  Skeleton,
  Row,
  Modal,
  Select,
  Button,
  Checkbox,
  Empty,
  Input,
  Form,
  message,
} from 'antd'
import dayjs from 'dayjs'
import 'dayjs/locale/tr'
import { format } from 'date-fns'
import cn from 'classnames'
import instance from '../../utils/axios'
import PageTitle from '../../components/PageTitle'
import { Box, SearchFavorite, Filter } from 'iconsax-react'

const WarrantyCertifcate = (props) => {
  const [noDate, setNoData] = useState([])
  const [isDataLoaded, setIsDataLoaded] = useState(false)
  const [categories, setCategories] = useState([])
  const [selectedTopCategory, setselectedTopCategory] = useState({
    value: 0,
    label: 'Ana Kategori Seçiniz',
  })
  const [selectedSubCategory, setselectedSubCategory] = useState({
    value: 0,
    label: 'Alt Kategori Seçiniz',
  })
  const [selectedProductCategory, setselectedProductCategory] = useState()
  const [subCategories, setSubCategories] = useState([])
  const [productsCategories, setProductCategories] = useState([])
  const [products, setProducts] = useState([])
  const [productCodeValue, setProductCodeValue] = useState('')
  useEffect(() => {
    retrieveCategoryData()
  }, [])
  useEffect(() => {
    setselectedSubCategory([])
    setProducts([])
    setSubCategories([])

    selectedTopCategory > 0 && retrieveSubCategoryData()
  }, [selectedTopCategory])
  useEffect(() => {
    selectedProductCategory > 0 && retrieveProductData()
  }, [selectedProductCategory])
  const retrieveCategoryData = () => {
    instance.post('top_categories').then(
      (response) => {
        const newArr = response.data.map((i) => {
          i.value = i.id
          i.label = i.name
          return i
        })
        newArr.push({ value: 0, label: 'Ana Kategori Seçiniz' })
        setCategories(newArr)
      },
      (error) => {
        if (error.response) {
          console.log(error.response)
        }
      }
    )
  }
  const retrieveSubCategoryData = () => {
    setNoData(true)
    instance
      .post(`/category_with_top_category?CategoryId=${selectedTopCategory}`)
      .then(
        (response) => {
          const newArr = response.data.map((i) => {
            i.value = i.id
            i.label = i.name
            return i
          })
          newArr.push({ value: 0, label: 'Alt Kategori Seçiniz' })
          setSubCategories(newArr)
        },
        (error) => {
          if (error.response) {
          }
        }
      )
  }
  const retrieveProductCategoryData = (selectedSubCategory) => {
    instance
      .post(`/category_with_top_category?CategoryId=${selectedSubCategory}`)
      .then(
        (response) => {
          const newArr = response.data.map((i) => {
            i.value = i.id
            i.label = i.name
            return i
          })
          setProductCategories(newArr)
        },
        (error) => {
          if (error.response) {
            console.log(error.response)
            serviceExceptionHandler(error.response, props.history)
          }
        }
      )
  }
  const productSortMethod = (product1, product2) => {
    return (
      (product2.productPrice && product2.productPrice.value
        ? product2.productPrice.value
        : 0.0) -
      (product1.productPrice && product1.productPrice.value
        ? product1.productPrice.value
        : 0.0)
    )
  }
  const retrieveProductData = () => {
    setNoData(false)
    setProducts([])
    setIsDataLoaded(false)
    instance
      .post(
        `/instore_app_product_for_tag?CategoryId=${selectedProductCategory}`
      )
      .then(
        (response) => {
          if (response.data.length > 0) {
            const sortedProducts = response.data.sort((p1, p2) =>
              productSortMethod(p1, p2)
            )
            setProducts(sortedProducts)
            setIsDataLoaded(true)
          } else {
            setNoData(true)
          }
        },
        (error) => {
          if (error.response) {
            console.log(error.response)
            serviceExceptionHandler(error.response, props.history)
          }
        }
      )
  }
  const [progressForSearchBox, setProgressForSearchBox] = useState(false)
  const retrieveProductDetailsFromSearchBox = () => {
    setIsDataLoaded(false)
    if (productCodeValue.length > 2) {
      setProductCategories([])
      setProgressForSearchBox(true)
      let productCodes = [productCodeValue]

      instance
        .post(`/instore_app_product_for_tag_for_searchbox?asc=`, {
          productCodes,
        })
        .then(
          (response) => {
            if (response.data.length === 0) {
              setProducts([])
              //   setNoProductFound(true)
              setProgressForSearchBox(false)

              message.warning('Kayıt bulunamadı', 'isSearchedProduct')
            } else {
              setProducts(response.data)
              //   setNoProductFound(false)
              setIsDataLoaded(true)
              setProgressForSearchBox(false)
              let finalCategory =
                response.data[0].categories.length > 0
                  ? response.data[0].categories[0].instoreAppProductCategory
                  : null
              if (finalCategory != null) {
                let previousCategory = null
                for (let i = 0; i < 5; i++) {
                  if (finalCategory.topCategory !== null) {
                    previousCategory = finalCategory
                    // finalCategory = topCategoryRetrieve(finalCategory)
                  } else {
                    break
                  }
                }
                // setCategoryDropdownTitle(finalCategory.name)
                // handleCategoryDropdownSelect(finalCategory.id.toString());
                // setSubCategoryDropdownTitle(previousCategory.name)
              }

              message.success('Kayıt başarıyla alındı', 'isSearchedProduct')
            }
          },
          (error) => {
            if (error.response) {
              console.log(error.response)
              message.error(
                'İşleminiz gerçekleştirilirken hata oluştu.',
                'isSearchedProduct'
              )
            }
          }
        )
    } else {
      message.warning('Lütfen En Az 3 Haneli Ürün Kodu Giriniz.')
    }
  }
  const keyPressHandler = (event) => {
    if (event.key === 'Enter') {
      retrieveProductDetailsFromSearchBox()
    }
  }
  const handleCodeChange = (e) => {
    setProductCodeValue(e.target.value)
  }
  console.log(products)
  return (
    <>
      <PageTitle
        title='Garanti Belgesi'
        icon={<Box color='#8E92BC' />}
        action={
          <Input.Search
            // onSearch={(event) => keyPressHandler(event)}
            onKeyPress={(event) => keyPressHandler(event)}
            onChange={handleCodeChange}
            enterButton
            loading={progressForSearchBox}
            className='w-1/4'
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
              Kategoriler
            </h1>

            <div className='py-3'>
              <Form layout='vertical'>
                <Form.Item label='Anakategori'>
                  <Select
                    className='w-full'
                    size='large'
                    placeholder='Ana Kategori Seçiniz'
                    value={selectedTopCategory}
                    onChange={(e) => {
                      setselectedTopCategory(e)
                    }}
                    options={categories}
                  />
                </Form.Item>

                <Form.Item label='Alt'>
                  <Select
                    className='w-full'
                    size='large'
                    value={selectedSubCategory}
                    placeholder='Kategori Seçiniz'
                    onChange={(e) => {
                      setselectedSubCategory(e)
                      setselectedProductCategory(e)
                      retrieveProductCategoryData(e)
                    }}
                    options={subCategories}
                  />
                </Form.Item>
                <Form.Item label='sad'>
                  <Select
                    className='w-full'
                    size='large'
                    placeholder='Kategori Seçiniz'
                    // value={selectedProductCategory}
                    onChange={(e) => {
                      setselectedProductCategory(e)
                    }}
                    options={productsCategories}
                  />
                </Form.Item>
              </Form>
              <div className='flex items-center justify-end gap-3 mt-3'>
                <Button size='lg' onClick={() => {}}>
                  Filtreyi Temizle
                </Button>
                <Button type='primary' size='lg' onClick={() => {}}>
                  Filtrele
                </Button>
              </div>
            </div>
          </div>
        </Col>
        <Col className='gutter-row' span={18}>
          <div className=' bg-white rounded-lg p-8'>
            <h2 className='text-xl text-[#030229] font-bold mb-6'>
              Kupon Listeleme
            </h2>
            {isDataLoaded ? (
              products.length > 0 ? (
                <table class='w-full text-sm text-left text-gray-500 dark:text-gray-400'>
                  <thead class='text-xs text-gray-700 uppercase border-b border-gray-200 dark:bg-gray-700 dark:text-gray-400'>
                    <tr>
                      <th scope='col' class='px-6 py-3'>
                        Kupon Codu
                      </th>
                      <th scope='col' class='px-6 py-3'>
                        Ürün Grubu
                      </th>
                      <th scope='col' class='px-6 py-3'>
                        Ürün Alt Gurub
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((i) => (
                      <tr class='bg-white  hover:bg-gray-300 transition-all rounded-lg dark:border-gray-700 cursor-pointer'>
                        <th
                          scope='row'
                          class='px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white'
                        >
                          {i.code}
                        </th>
                        <td class='px-6 py-4'>{i.name}</td>

                        <td class='px-6 py-4'>{i.name}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className='flex items-center justify-center p-3 mt-4 w-full'>
                  <Empty description='Kayıtlı Kupon Bulunamadı' />
                </div>
              )
            ) : (
              <div className='flex items-center justify-center p-2 mt-4'>
                <Skeleton />
              </div>
            )}
          </div>
        </Col>
      </Row>
    </>
  )
}
export default WarrantyCertifcate
