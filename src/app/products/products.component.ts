import { Component, OnInit } from '@angular/core';
import { ProductService } from '../services/product.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css'],
})
export class ProductsComponent implements OnInit {
  products: any[] = [];
  selectedProduct: any = null;
  newProduct = { name: '', category: '', price: 0, thumbnail: '' }; // Thêm thuộc tính thumbnail
  selectedCategoryId: number = 1; // Default category = 1

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.getAllProducts(); // Lấy sản phẩm cho category mặc định (categoryId = 1)
  }

  // Lấy danh sách sản phẩm theo categoryId
  getAllProducts(): void {
    this.productService.getProductsByCategoryId(this.selectedCategoryId).subscribe(
      (products) => {
        this.products = products;
      },
      (error) => {
        console.error('Lỗi khi lấy danh sách sản phẩm:', error);
      }
    );
  }

  // Tạo sản phẩm mới
  createProduct(): void {
    this.productService.createProduct(this.newProduct).subscribe(
      (product) => {
        this.products.push(product);
        this.newProduct = { name: '', category: '', price: 0, thumbnail: '' }; // Reset mẫu sản phẩm
      },
      (error) => {
        console.error('Lỗi khi tạo sản phẩm:', error);
      }
    );
  }

  // Chỉnh sửa sản phẩm
  updateProduct(): void {
    if (!this.selectedProduct) return;

    this.productService.updateProduct(this.selectedProduct.id, this.selectedProduct).subscribe(
      (updatedProduct) => {
        const index = this.products.findIndex((p) => p.id === updatedProduct.id);
        this.products[index] = updatedProduct;
        this.selectedProduct = null;
      },
      (error) => {
        console.error('Lỗi khi cập nhật sản phẩm:', error);
      }
    );
  }

  // Xóa sản phẩm
  deleteProduct(productId: number): void {
    this.productService.deleteProduct(productId).subscribe(
      () => {
        this.products = this.products.filter((p) => p.id !== productId);
      },
      (error) => {
        console.error('Lỗi khi xóa sản phẩm:', error);
      }
    );
  }

  // Chọn sản phẩm để chỉnh sửa
  selectProduct(product: any): void {
    this.selectedProduct = { ...product };
  }

  // Thay đổi danh mục sản phẩm (1 hoặc 2)
  onCategoryChange(categoryId: number): void {
    this.selectedCategoryId = categoryId;
    this.getAllProducts(); // Cập nhật lại danh sách sản phẩm khi thay đổi danh mục
  }
}
