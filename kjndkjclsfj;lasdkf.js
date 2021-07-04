define(['createSupplier/module'], function (module) {
    'use strict';
    module.registerController('createSupplierCtrl', function (Upload,$q,serverUrl,$scope, $http, $state, $cookies, $window,$location,$modal, accessKey, secretKey) {
    $scope.dataTable='notaList'; 
   
    $scope.allowAttachment=false; // initiall hide the attachment provision
    $scope.activeProgress=false; //to get the progress bar
    var loc= $location.path().split('/');; // TO GET THE LOCATION PATH
    console.log(loc);
    var loader = angular.element( document.querySelector( '#loader' ));
    $scope.actionButton="Save";
    
    // CONNECTION TO S3 BUCKET by Akanksha Jagtap------------------------------------
    $scope.creds = {
        bucket: 'tas-po-files-testing/supplier-attachments',
        access_key: accessKey,
        secret_key: secretKey
        // access_key: 'AKIAJKTMN2W2YKFHMCRQ',
        // secret_key: '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'
    }
    AWS.config.update({ accessKeyId: $scope.creds.access_key, secretAccessKey: $scope.creds.secret_key });
    AWS.config.region = 'ap-south-1';
    var bucket = new AWS.S3();
         
    //-------------------------
    var doc_no,supplierRev_id;

     doc_no='TPC_DOC_';      
     supplierRev_id = "SupplierAttachRev_"

    //AJAX CALL 
    function ajaxcall(inputData,funName) {        
        console.log(JSON.stringify(inputData));
       
        loader.addClass('widget-body-ajax-loading');
        $http.post(serverUrl,inputData).success(function(res){ 
            console.log(res)               
            switch(res.sts){
                case 0:
                    switch(funName){
                        case 'UpdateAttachments':
                        case 'updateSup':
                        case 'delete1':
                        case 'delete':
                        
                            $.smallBox({
                                title: "<span class='font-sm txt-color-green'><strong>Success</strong></span>",
                                content: "<i class='txt-color-green' style='font-size:14px'>"+res.data+"</i>",
                                color: "#e4fcf7",
                                icon: "fa fa-bell-o swing animated txt-color-green font-sm",
                                timeout: 2000
                            });
                            if(funName === 'delete'){
                                $scope.Display();   
                            }else{
                                
                                $state.go('app.createSupplier');

                            }
                            
                        break;
                        case 'add':
                            $.SmartMessageBox({
                                title: res.data,
                                content:"<i class='font-md'>Do you want to link any attachments to this supplier? </i>",
                                buttons: '[No][Yes]'
                            }, function (ButtonPressed) {
                                if (ButtonPressed === "Yes") {
                                    $scope.allowAttachment=true;

                                }else{

                                   $state.go('app.createSupplier');
                                }
                          
                            });
                        break;
                        case 'edit':
                            $scope.actionButton='Update';
                            $scope.sup_id=res.data.SUP_ID;
                            $scope.sup_contc_person=res.data.SUP_CONTC_NAME;
                            $scope.sup_name=res.data.SUP_NAME;
                            $scope.sup_gst=res.data.SUP_GST;
                            $scope.sup_email=res.data.SUP_EMAIL;
                            $scope.sup_mob1=res.data.SUP_PHONE1;
                            $scope.sup_mob2=res.data.SUP_PHONE2;
                            $scope.sup_address=res.data.SUP_ADDRESS;
                            $scope.sup_pay_terms=res.data.SUP_PAY_TERM;
                            $scope.attachments=res.data.SUP_ATTACHMENTS;
                            $scope.allowAttachment=true; //show attachment fields
                        break;
                       case 'getAutoNo2':
                                var data=res.data;
                            console.log("get Auto docID",JSON.stringify(res.data) )
                                if(data.length == 0){
                                   
                                    
                                    $scope.po_no=doc_no+'001';
                                
                                }else{
                                    var resArray=[];
                                    var data=res.data;
                                    console.log(data)
                                    for(var i in data){
                                        resArray.push(parseInt(data[i].DOC_ID.slice(-3)))
                                    }
                                    
                                    var resdata= Math.max.apply(Math,resArray.map(function(item){return item;}));
                                    console.log(resdata) 
                                    
                                    resdata=parseInt(resdata)+1;
                    
                                    if(resdata.toString().length == 1){
                                        $scope.doc_no_id=doc_no+'00'+resdata;
                                    
                                    }else{
                                        $scope.doc_no_id=doc_no+'00'+resdata;
                                    }
                                }
                                console.log("get Auto docID",JSON.stringify( $scope.doc_no_id) )
                            break;
                        default : 
                            $scope.SUP_LIST = res.data;
                            $scope.dataTable='list';
                        break; 
                    }

                break;
                case 1:                    
                    $.smallBox({
                        title: "<span class='font-sm txt-color-blue'><strong>Info</strong></span>",
                        content: "<i class='txt-color-blue' style='font-size:14px'>"+res.data+"</i>",
                        color: "#f0f8fd",
                        icon: "fa fa-bell-o swing animated txt-color-blue font-xs",
                        timeout: 4000
                    });
                break;
                case 2:
                    $.smallBox({
                        title: "<span class='font-sm txt-color-red'><strong>Error</strong></span>",
                        content: "<i class='txt-color-red' style='font-size:14px'>"+res.data+"</i>",
                        color: "#fde1e1",
                        icon: "fa fa-bell-o swing animated txt-color-red font-xs",
                        timeout: 4000
                    });
                    $state.go('login');
                   
                break;
            }
            loader.removeClass('widget-body-ajax-loading'); 
        });// END OF AJAX CALL
    }

    $scope.Display=function(){
        var supList= {"email": $window.sessionStorage.email,"token": $window.sessionStorage.token,"proc": "list","module": "po_supplier_details","fields": "CREATED_BY,SUP_CONTC_NAME,SUP_NAME,SUP_ID,SUP_GST,SUP_EMAIL,SUP_PHONE1,SUP_PHONE2,SUP_ADDRESS,SUP_PAY_TERM,SUP_ATTACHMENTS,SUP_BANK_ACC,SUP_BANK_IFSC,SUP_BANK_NAME"}
        $scope.dataTable='notaList';
        ajaxcall(supList,'display'); 
    }
    // SUPPLIER LIST TO DISPLAY INTO THE TABLE by Akanksha 
    
    if(loc[1] == "createSupplier" && loc[2]!= "add" && loc[2]!= "edit"){
         $scope.Display();
    }else if(loc[1] == "createSupplier" && loc[2] == "edit" && loc[2] != "add" && loc[3] != " "){
        
        var editInput ={"email":$window.sessionStorage.email,"token":$window.sessionStorage.token,"key":{"SUP_ID": loc[3]},"module":"po_supplier_details","proc":"edit"}
        ajaxcall(editInput,"edit")
    }

    //DELETE SUPPLIER W.R.T (ID=SUP_ID)-AKANKSHA
    $scope.deleteSup = function (id){
        console.log(id);
        $.SmartMessageBox({
            title: "Are You Sure?",
            content: "You want to delete this Supplier ?",
            buttons: '[No][Yes]'
        }, function (ButtonPressed) {
            if (ButtonPressed === "Yes") {
                var deleteInput ={"email":$window.sessionStorage.email,"token":$window.sessionStorage.token,"key":{"SUP_ID": id},"module":"po_supplier_details","proc":"delete"}
                ajaxcall(deleteInput,'delete');
                  var deleteInput1 = {"email": $window.sessionStorage.email, "token": $window.sessionStorage.token, "key": {"UNIQUE_ID": id}, "module": "document_details", "proc": "delete" };
                console.log("deletePO", JSON.stringify(deleteInput1));
                
                ajaxcall(deleteInput1,'delete1');
            }
        });
    }//END OF SCOPE.DELETE SUPPLIER

   

    //ADD SUPPLIER FUNCTION-BY AKANKSHA
    $scope.addSup =function(){
               
        var addInput = {"email": $window.sessionStorage.email,"token": $window.sessionStorage.token,"proc": "add","module": "po_supplier_details","item": {"SUP_ID":$scope.sup_id,"SUP_NAME": $scope.sup_name,"SUP_CONTC_NAME": $scope.sup_contc_person,"SUP_GST": $scope.sup_gst,"SUP_EMAIL": $scope.sup_email,"SUP_PHONE1": $scope.sup_mob1,"SUP_PHONE2": $scope.sup_mob2,"SUP_ADDRESS": $scope.sup_address,"SUP_PAY_TERM": $scope.sup_pay_terms,"SUP_ATTACHMENTS":$scope.attachments,"SUP_BANK_NAME":$scope.sup_bank_name,"SUP_BANK_ACC":$scope.sup_bank_acc_no,"SUP_BANK_IFSC":$scope.sup_ifsc_code},"key": {"SUP_ID":$scope.sup_id}}
        console.log(addInput)
        ajaxcall(addInput,'add');      
    }//end of $scope.SUPPLIER

    // UPDATE SUPPLIER 
    $scope.updateSup=function(){
        
        var updateInput = {"email": $window.sessionStorage.email,"token": $window.sessionStorage.token,"proc": "update","module": "po_supplier_details","key": {"SUP_ID":loc[3] },"updateExp": "set  SUP_NAME=:sname,SUP_CONTC_NAME=:scontcName, SUP_GST=:sgst, SUP_PHONE1=:sPhone1,SUP_PHONE2=:sPhone2,SUP_ADDRESS=:saddr,SUP_PAY_TERM=:spayTerms,SUP_EMAIL=:sEmail,SUP_ATTACHMENTS=:attchmnts,SUP_BANK_NAME=:sBank,SUP_BANK_IFSC=:sIfsc,SUP_BANK_ACC=:sBankAcc","value": {":sname": $scope.sup_name,":scontcName": $scope.sup_contc_person,":sEmail": $scope.sup_email,
            ":sPhone1": $scope.sup_mob1,":sPhone2":$scope.sup_mob2,":saddr":$scope.sup_address,":sgst":$scope.sup_gst,":spayTerms":$scope.sup_pay_terms,":attchmnts":$scope.attachments,":sBank":$scope.sup_bank_name,":sIfsc":$scope.sup_ifsc_code,":sBankAcc":$scope.sup_bank_acc_no}}



        var deferred = $q.defer();
        var promise = deferred.promise;
        promise.then(function () {
            angular.forEach(updateInput.value, function(value, key) {
                if(value == undefined || value == ''){
                   updateInput.value[key]='-' ;     // if any non optional field is empty replace it with "-"
                   updateInput.value[':attchmnts']=[];

                }
                
            });
            // callback(); 
        }).then(function () {
            // console.log(updateInput)
            console.log("after everythng")
            ajaxcall(updateInput,"updateSup")
        });
        deferred.resolve();   
    } //END OF UPDATE USER  

    $scope.getKey=function(name){
        if(name !== undefined){
            $scope.sup_id=btoa(name.replace(/[\. ,:-]+/g, "").toLowerCase());
            console.log(name);
           
        }
        
    }
    
   
    // UPDATE THE ATTACHMENT FIELD AFTER SAVING THE DATA IN DB
    $scope.UpdateAttachments=function(){
        var updateAttach = {"email": $window.sessionStorage.email,"token": $window.sessionStorage.token,"proc": "update","module": "po_supplier_details","key": {"SUP_ID":$scope.sup_id},"updateExp": "set SUP_ATTACHMENTS=:attchmnts","value": {":attchmnts":$scope.attachments}};
        ajaxcall(updateAttach,"UpdateAttachments")      
    }

    //--------------------------attachments of files----------------------    
    $scope.fileList = [];
    $scope.attachments=[];
    $scope.attachFiles = function (file) {
          var poNoInput = {"FilterExp":"contains(DOC_ID,:docId)","value":{":docId":doc_no},"email":$window.sessionStorage.email,"token":$window.sessionStorage.token,"fields":"DOC_ID","proc":"getAutoNo","module":"document_details"};            
            ajaxcall(poNoInput,'getAutoNo2');
        console.log(file)
        $.SmartMessageBox({
            title: "Are You Sure?",
            content: "You want to Save this file ?",
            buttons: '[No][Yes]'
        }, function (ButtonPressed) {
            if (ButtonPressed === "Yes") {
                if($scope.fileList.length <= 4 && $scope.attachments.length<=4){
                    if(file.size < 2097152 ){
                   
                        if(file){
                            var params = {Bucket: $scope.creds.bucket, Key:$scope.sup_id+'_'+file.name, ContentType:file.type, ACL: 'public-read', Body: file, ServerSideEncryption: 'AES256' };
                            console.log(params.Body);
                            $scope.activeProgress=true;
                            bucket.putObject(params, function(err, data) {
                                if(err) {
                                // There Was An Error With Your S3 Config
                                alert(err.message);
                                return false;
                                }
                                else {
                                    $scope.activeProgress=false;
                                    $scope.fileList.push(file); //to show in file list table 
                                    $scope.attachments.push('https://s3-ap-south-1.amazonaws.com/'+$scope.creds.bucket+'/'+$scope.sup_id+'_'+file.name) 
                                    console.log($scope.fileList);
                                    console.log($scope.attachments)
                                }
                            })
                            .on('httpUploadProgress',function(progress) {
                                  // Log Progress Information
                                $scope.uploadProgress=Math.round(progress.loaded / progress.total * 100) + '%';
                              
                                console.log($scope.uploadProgress)
                                var solvency =  {"email": $window.sessionStorage.email,"token": $window.sessionStorage.token,"proc": "add", "module": "document_details",  "item": {
                     "UNIQUE_ID": $scope.sup_id, "DOC_ID": $scope.doc_no_id, "TPC_MODULE": "Supplier Details","DOC_TYPE": file.type, "S3_LINK": 'https://s3-ap-south-1.amazonaws.com/'+$scope.creds.bucket+'/'+$scope.sup_id+'_'+file.name, "MODE_OF_DOC": "ATTACHED",
                     "REVISION":$scope.supplierRevId }, "key": { "UNIQUE_ID": $scope.sup_id, "DOC_ID": $scope.doc_no_id}}     
                      ajaxcall(solvency,'documentation');
                               
                            });
                        }else {
                        // No File Selected
                        alert('No File Selected');
                        }
                    }else{
                        alert('File size should be 2 MB Only');
                    }
                }else{
                     alert('Max 5 File Only');
                    $scope.activeProgress=false;
                }
                angular.element("input[type='file']").val(null);    
            }
        });   
    };
      
    
    
    // remove selected File
    $scope.removefile=function(idx,name,identity){
        console.log(name)
        $.SmartMessageBox({
            title: "Are You Sure?",
            content: "You want to delete this file ?",
            buttons: '[No][Yes]'
        }, function (ButtonPressed) {
            if (ButtonPressed === "Yes") {
                loader.addClass('widget-body-ajax-loading');
                if(identity == 'AlreadySaved'){
                    var params = {
                        Bucket: $scope.creds.bucket,
                        Key:name.substring(name.lastIndexOf('/')+1)

                    }
                     
                }else if(identity == 'ToUpload'){
                    var params = {
                        Bucket: $scope.creds.bucket,
                        Key:$scope.sup_id+'_'+name
                    }; 
                }
                
                console.log(params)
                bucket.deleteObject(params, function (err, data) {
                    if (data) {
                        console.log("File Removed successfully");
                        console.log(data);
                        if(identity == 'AlreadySaved'){

                            $scope.attachments.splice(idx,1);

                        }else if(identity == 'ToUpload'){

                            $scope.fileList.splice(idx,1);
                            $scope.attachments.splice(idx,1); 

                        }
                        console.log($scope.attachments)
                        $.smallBox({
                            title: "<span class='font-sm txt-color-green'><strong>Success</strong></span>",
                            content: "<i class='txt-color-green' style='font-size:14px'>File Removed successfully</i>",
                            color: "#e4fcf7",
                            icon: "fa fa-bell-o swing animated txt-color-green font-sm",
                            timeout: 4000
                        });
                    }
                    else {
                        console.log("Check if you have sufficient permissions : "+err);
                        $.smallBox({
                            title: "<span class='font-sm txt-color-blue'><strong>Info</strong></span>",
                            content: "<i class='txt-color-blue' style='font-size:14px'>File unable to remove</i>",
                            color: "#f0f8fd",
                            icon: "fa fa-bell-o swing animated txt-color-blue font-xs",
                            timeout: 4000
                        });
                    }
                    loader.removeClass('widget-body-ajax-loading');
                });
            }
        });
    }
      
    //--------------------------attachments of files----------------------      
      
   






















    });
});
