import { Component } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { Product } from '../../common/product';
import { ActivatedRoute } from '@angular/router';
import { CartService } from '../../cart.service';
import { CartItem } from '../../common/cart-item';
@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css'
})
export class ProductListComponent {
  
  products: Product[] =[];
  currentCategoryId: number = 1;
  searchMode:Boolean = false;
  previousCategoryId: number=1;

  // new properties for paginantion
  thePageNumber:number  =1;
  thePageSizeNumber:number =5;
  theTotalElements:number =0;
  previousKeyword:string="";
  constructor(private productService:ProductService,
              private route:ActivatedRoute,
              private cartService:CartService){

  }

  ngOnInit(){
    this.route.paramMap.subscribe(()=>{
      this.getProductList();
    })
  }
  // Check if id Parameter is avalible 
  getProductList() {
    this.searchMode = this.route.snapshot.paramMap.has('keyword');
    if(this.searchMode){
      this.handleSearchProducts();
    }else{
      this.handleListProducts();
    }

  }
  handleSearchProducts(){
    const theKeyword: string = this.route.snapshot.paramMap.get('keyword')!;
    //if we have a diffrent keyword than the previous
    //then set number to one
    if(this.previousKeyword != theKeyword){
      this.thePageNumber=1;
    }

    this.previousKeyword = theKeyword;
    console.log(`keywords=${theKeyword}, thePageNumber=${this.thePageNumber}`);
    this.productService.searchProductPaginate(this.thePageNumber -1,
                                              this.thePageSizeNumber,
                                              theKeyword).subscribe(this.processResult())
  }
  handleListProducts(){
    const hasCategoryId:boolean = this.route.snapshot.paramMap.has('id');

    if(hasCategoryId){
      // get the "id" paramstring/ convertstring to a number using the "+" symbol
      this.currentCategoryId =+this.route.snapshot.paramMap.get('id')!;
    }else{
      //not category avalible ... deafualt to category id 1
      this.currentCategoryId =1;
    }

    //Check for diffrent category than previous
    //Angular resuses components if it is currenlty being viewed

    //if we have a diffrent category id than prvious then set page number back to one
      if(this.previousCategoryId != this.currentCategoryId){
        this.thePageNumber = 1;
      }
      else{
        this.previousCategoryId = this.currentCategoryId;
      }
      console.log(`currentCategoryId=${this.currentCategoryId}, thePageNumber=${this.thePageNumber}`);

    // now get the products for the fiven category id 
    this.productService.getProductPaginate(this.thePageNumber -1,
                                          this.thePageSizeNumber,
                                          this.currentCategoryId)
                                          .subscribe(this.processResult());
  }
  updatePageSize(pageSize: string){
    this.thePageSizeNumber= +pageSize;
    this.thePageNumber=1;
    this.getProductList();
  }
  processResult(){
    return(data:any)=>{
      this.products = data._embedded.products;
      this.thePageNumber = data.page.number+ 1;
      this.thePageSizeNumber = data.page.size;
      this.theTotalElements = data.page.totalElements;
    }
  }
  addToCart(theProduct: Product){
    console.log(`Adding to cart: ${theProduct.name}, ${theProduct.unitPrice}`);

    const theCartItem =new CartItem(theProduct);

    this.cartService.addToCart(theCartItem);
  }
}
