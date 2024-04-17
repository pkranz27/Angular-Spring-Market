import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ShopFormService } from '../../services/shop-form.service';
import { Country } from '../../common/country';
import { State } from '../../common/state';
import { CustomValidators } from '../../validators/custom-validators';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css'
})
export class CheckoutComponent implements OnInit {


  checkOutFormGroup!:FormGroup;

  totalPrice:number =0;
  totalQuantity:number=0;

  creditCardYears:number[] = [];
  creditCardMonths:number[]= [];

  countires: Country[] = [];

  shippingAddress: State[] = [];
  billingAddress: State[] = [];

  constructor(private formBuilder: FormBuilder,
              private shopFormService: ShopFormService){}

  ngOnInit(): void {
    this.checkOutFormGroup = this.formBuilder.group({
      customer:this.formBuilder.group({
        firstName: new FormControl('',
        [Validators.required, Validators.minLength(3), CustomValidators.notOnlyWhitespace]),
        lastName: new FormControl('',
        [Validators.required, Validators.minLength(3),CustomValidators.notOnlyWhitespace]),
        email: new FormControl('',
                                [Validators.required,Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'), CustomValidators.notOnlyWhitespace])
      }),
      shippingAddress:this.formBuilder.group({
        country: new FormControl('',
        [Validators.required]),
        street: new FormControl('',
        [Validators.required, Validators.minLength(3), CustomValidators.notOnlyWhitespace]),
        city: new FormControl('',
        [Validators.required, Validators.minLength(3), CustomValidators.notOnlyWhitespace]),
        state: new FormControl('',
        [Validators.required]),
        zipCode: new FormControl('',
        [Validators.required, Validators.minLength(3), CustomValidators.notOnlyWhitespace]),
      }),
      billingAddress:this.formBuilder.group({
        country: new FormControl('',
        [Validators.required]),
        street: new FormControl('',
        [Validators.required, Validators.minLength(3), CustomValidators.notOnlyWhitespace]),
        city: new FormControl('',
        [Validators.required, Validators.minLength(3), CustomValidators.notOnlyWhitespace]),
        state: new FormControl('',
        [Validators.required]),
        zipCode: new FormControl('',
        [Validators.required, Validators.minLength(3), CustomValidators.notOnlyWhitespace]),
      }),
      creditCard:this.formBuilder.group({
        cradType: new FormControl('' ,
          [Validators.required, Validators.minLength(3), CustomValidators.notOnlyWhitespace]),
        nameOnCard: new FormControl('' ,
        [Validators.required, Validators.minLength(3), CustomValidators.notOnlyWhitespace]),
        cardNumber:new FormControl('' ,
        [Validators.required, Validators.minLength(3), CustomValidators.notOnlyWhitespace]),
        securityCode:new FormControl('' ,
        [Validators.required, Validators.minLength(2), CustomValidators.notOnlyWhitespace]),
        expirationMonth:new FormControl('' ,
        [Validators.required, Validators.minLength(2), CustomValidators.notOnlyWhitespace]),
        expirationYear:new FormControl('' ,
        [Validators.required, Validators.minLength(3), CustomValidators.notOnlyWhitespace]),
      })
    });
    ///////
    // populate credit card months
    const startMonth:number = new Date().getMonth()+1;
    console.log("startMonth"+ startMonth)

    this.shopFormService.getCreditCardMonths(startMonth).subscribe(
      data=>{
        console.log("Retrived credit card number"+JSON.stringify(data));
        this.creditCardMonths = data;
      }
    )
    //populate acredit card years 
    this.shopFormService.getCreditCardYears().subscribe(
      data=>{
        console.log("Retrived credit card number"+JSON.stringify(data));
        this.creditCardYears = data;
      }
    )
    //populate the countries
    this.shopFormService.getCountries().subscribe(
      data => {
        console.log("Retrived countries"+ JSON.stringify(data));
        this.countires =data
      }
    )
  }
  getStates(formGroupName: string) {
    const formGroup = this.checkOutFormGroup.get(formGroupName);
    const countryCode = formGroup.value.country.code
    const countryName = formGroup.value.country.code;

    console.log(`{formGroupname} countryCode: ${countryCode}`);
    console.log(`{formGroupname} countryName:; ${countryName}`);

    this.shopFormService.getStates(countryCode).subscribe(
      data =>{
        
        if(formGroupName === 'shippingAddress'){
          this.shippingAddress = data;
        }else{
          this.billingAddress = data;
        }
        // select first item by default
        formGroup.get('state').setValue(data[0]);
      }
    )
    }

    //Getter methods for Validation
    get firstName(){return this.checkOutFormGroup.get('customer.firstName')};
    get lastName(){return this.checkOutFormGroup.get('customer.lastName')};
    get email(){return this.checkOutFormGroup.get('customer.email')};

    get shippingAddressStreet(){return this.checkOutFormGroup.get('shippingAddress.street')};
    get shippingAddressCity(){return this.checkOutFormGroup.get('shippingAddress.city')};
    get shippingAddressState(){return this.checkOutFormGroup.get('shippingAddress.state')};
    get shippingAddressZipCode(){return this.checkOutFormGroup.get('shippingAddress.zipCode')};
    get shippingAddressCountry(){return this.checkOutFormGroup.get('shippingAddress.country')};


    get billingAddressStreet(){return this.checkOutFormGroup.get('billingAddress.street')};
    get billingAddressCity(){return this.checkOutFormGroup.get('billingAddress.city')};
    get billingAddressState(){return this.checkOutFormGroup.get('billingAddress.state')};
    get billingAddressZipCode(){return this.checkOutFormGroup.get('billingAddress.zipCode')};
    get billingAddressCountry(){return this.checkOutFormGroup.get('billingAddress.country')};
 

  copyShippingAddressToBillingAddress(event) {
    if(event.target.checked){
      this.checkOutFormGroup.controls['billingAddress']
      .setValue(this.checkOutFormGroup.controls['shippingAddress'].value);
    }
    }
  onSubmit(){
    console.log("Handling the submit button");

    if(this.checkOutFormGroup.invalid){
      this.checkOutFormGroup.markAllAsTouched();
    }

    console.log(this.checkOutFormGroup.get('customer')?.value);

    console.log("The email address is "+ this.checkOutFormGroup.get('customer').value.email);
    
    console.log("The shipping address country is "+ this.checkOutFormGroup.get('shippingAddress').value.country);
    console.log("The shipping address state is "+ this.checkOutFormGroup.get('shippingAddress').value.state);

  }
  handleMonthsAndYears() {
    const creditCardFormGroup = this.checkOutFormGroup.get('creditCard');

    const currentYear: number = new Date().getFullYear();
    const selectedYear:number = Number(creditCardFormGroup.value.expirationYear);

    let startMonth:number;

    if(currentYear === selectedYear){
      startMonth = new Date().getMonth()+1;
    }
    else{
      startMonth = 1;
    }
    this.shopFormService.getCreditCardMonths(startMonth).subscribe(
      data =>{
        console.log("Retrived creedit card months"+JSON.stringify(data));
        this.creditCardMonths = data;
      }
    )
  } 
}
