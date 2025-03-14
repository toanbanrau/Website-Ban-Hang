import { Link } from "react-router-dom";
import IProduct from "../../interfaces/product";
import { useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import { toast } from "react-hot-toast";



// function component
function ProductList() {
  const [products, setProducts] = useState<IProduct[]>([]);
  useEffect(() => {
    const getAll = async () => {

      try {
        const { data } = await axios.get(` http://localhost:3000/products`)
        if (data) {
          setProducts(data);
        }
      } catch (error) {
        toast.error((error as AxiosError).message);
      }
    }
    getAll();

  }, [])

  const handleDelete = async (id: string) => {
    if (window.confirm('ban chac chan muon xoa k')) {
      if (id) {
        try {
          await axios.delete(`http://localhost:3000/products/${id}`)
          toast.success('xoa thanh cong');
          setProducts((prev: IProduct[]) => {
            return prev.filter((item: IProduct) => {
              return item.id != id;
            })
          })
        } catch (error) {
          toast.error((error as AxiosError).message)
        }
      }
    }
  }
  return( <div>
    <h1>Danh sách sản phẩm</h1>
    <table className="table" border = {1}
    >

      <thead >
        <tr >
          <th scope="col" >STT</th>
          <th scope="col">Tên</th>
          <th scope="col">Giá</th>
          <th scope="col">Ảnh</th>
          <th scope="col">Mô tả</th>
          <th scope="col">Action</th>
        </tr>
      </thead>
      <tbody>
        {products?.map((item: IProduct, index: number) => {
          return (
            <tr key={item.id}>
              <th scope="row">{index + 1}</th>
              <td>{item.name}</td>
              <td>{item.price}</td>
              <td><img src={item.thumbnail} height={"70px"} alt={item.thumbnail}/></td>
              <td>{item.description}</td>

              <td>
                <button className="btn btn-danger" onClick={() => { handleDelete(item.id) }} style={{
                    backgroundColor: '#dc3545',
                    color: '#fff',
                    border: 'none'
                    
                    
                  }}>XOÁ</button>
                <Link to={`edit/${item.id}`}>
                    <button className="btn btn-primary" 
                    style={{
                      backgroundColor: '#007bff',
                      color: '#fff',
                      border: "none"
                      }}>
                      Sửa
                      
                    </button>                
                </Link>
              </td>
            </tr>
          )
        })}


      </tbody>
    </table>


  </div>
  )
}

export default ProductList;
