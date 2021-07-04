import { Component, OnInit, Pipe } from '@angular/core';
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { InventoryService } from "../../core/services/inventory.service";
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
// import inventoryItems from "../../../assets/inventory.json";
@Component({
  selector: 'smart-inventory',
  templateUrl: './inventory.component.html'
})

@Pipe({                   //use for filter pipe
  name: "dataFilter"
})
export class InventoryComponent implements OnInit {
 
  // public items = inventoryItems;
  public data: any;
  public rowsOnPage = 10;
  public filterQuery = '';
  public sortBy = '';
  public sortOrder = 'desc';
  submitBtnTxt = "Add";
  id;
  formData;
  submitted: boolean = false;
  showLoader = false;
  showLoaderUI = false;

  constructor(private inventoryService: InventoryService,
    private toastr: ToastrService
  ) { }

  CreateForm(){
    const name = new FormControl('', [Validators.required]);
    const desc = new FormControl('', );
    const price = new FormControl('', [Validators.required, Validators.pattern("^[0-9\-]+(.[0-9]{0,11})?$")]);

    this.formData = new FormGroup({
      name: name,
      desc: desc,
      price: price
    });

  }

  ngOnInit() {
    this.CreateForm();
    this.getList();
  }

  getList() {
    this.showLoader = true;
    this.inventoryService.getList().subscribe(res=>{
      // console.log("Internal Data: " + JSON.stringify(res));
      this.showLoader = false;
      this.data = res;      
    },
      error => {
        this.showLoader = false;
        this.toastr.error('', 'Server Connection Failure', {
          enableHtml: true
        })
      });
  }


  editRecord(info: any): void {
    this.submitBtnTxt = "Update";
    this.id = info.id;
    this.formData.patchValue({
      name: info.name,
      desc: info.description,
      price: info.price,
    })
    // this.HttpClient.get(this.userService.apiURL+'/internalTags/' + info._id).subscribe(
    //   (result: any) => {
    //     this.formData.patchValue({
    //       tagName: result.tag_name,
    //       tagValue: result.tag_value,
    //       dataType: result.data_type,
    //     })
    //   },
    //   error => {
    //   }
    // );
  }

  deleteRecord(_id: any, name) {
    //console.log(_id);
    Swal.fire({
      title: 'Are you sure?',
      text: 'You want to delete \"'+name+'\" record',
      // type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.value) {
          this.inventoryService.removeItem(_id).subscribe(
          (result: any) => {
            console.log("Delete " + JSON.stringify(result));
            // if (result.response == "Tag Deleted Successfully !!") {
              this.toastr.success('', result.response, {
                enableHtml: true
              })
              this.getList();   
              this.resetForm();        
            // }
          })
      }
    });
  }

  onSubmit(frmData) {
    this.submitted = true;
    if (this.formData.invalid) {
      return;
    }else {
      if(this.submitBtnTxt === "Add"){
        this.showLoaderUI = true;
        var addReq = { 
          "name": frmData.name, 
          "description": frmData.desc, 
          "price": frmData.price 
        }; 
        this.inventoryService.insertItems(addReq).subscribe(res =>{
          console.log("add response data: " + JSON.stringify(res));
          this.showLoaderUI = false;
          // if (res["status"] == "success") {
            this.toastr.success('', res['response'], {
              enableHtml: true
            })
            this.resetForm();            
            this.getList();
          // } else if (res["status"] == "fail") {
          //   this.toastr.error('', res['response'], {
          //     enableHtml: true
          //   })
          // }        
        },
        error => {
          this.showLoaderUI = false;
        }
        );
      }else if(this.submitBtnTxt === "Update"){
        this.showLoaderUI = true;
        var updateTagReq = {
          "id": this.id, 
          "name": frmData.name, 
          "description": frmData.desc, 
          "price": frmData.price
        }; 
        console.log(JSON.stringify(updateTagReq))
        this.inventoryService.updateItem(updateTagReq).subscribe(res =>{
          console.log("update response data: " + JSON.stringify(res));
          this.showLoaderUI = false;
          // if (res["status"] == "success") {
            this.toastr.success('', res['response'], {
              enableHtml: true
            })
            this.resetForm();            
            this.getList();
          // } else if (res["status"] == "fail") {
          //   this.toastr.error('', res['response'], {
          //     enableHtml: true
          //   })
          // }        
        },
        error => {
          this.showLoaderUI = false;
        }
        );
      }
    }
  }

  resetForm() {
    this.submitBtnTxt="Add";
    this.submitted = false;
    this.formData.reset();
   
  }

}
