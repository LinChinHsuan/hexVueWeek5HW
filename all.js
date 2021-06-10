const url = "https://vue3-course-api.hexschool.io/"
const path = "linvueportfolio";
const app = Vue.createApp({
    data() {
      return {
        products:[],
        theProduct:{},
        qty:1,
        cart:{},
        isLoading:false,
        user:{
            email:'',
            username:'',
            phone:'',
            address:''
        }
      }
    },
    methods: {
        getProducts(){
            this.isLoading = true;
            axios.get(`${url}api/${path}/products`)
                .then(res => {
                    this.isLoading = false;
                    if(res.data.success) {
                        this.products = res.data.products;
                    } else {
                        alert(res.data.message);
                    }
                })
                .catch(err => {
                    this.isLoading = false;
                    console.log(err);
                })              
        },
        getProductDetail(id){
            this.isLoading = true;
            axios.get(`${url}api/${path}/product/${id}`)
                .then(res => {
                    this.isLoading = false;
                    if(res.data.success) {
                        this.theProduct = res.data.product;
                    } else {
                        alert(res.data.message);
                    }
                })
                .catch(err => {
                    this.isLoading = false;
                    console.log(err);
                })      
        },
        getCart(){
            this.isLoading = true;
            axios.get(`${url}api/${path}/cart`)
                .then(res => {
                    this.isLoading = false;
                    if(res.data.success) {
                        this.cart = res.data.data;
                    } else {
                        alert(res.data.message);
                    }
                })
                .catch(err => {
                    this.isLoading = false;
                    console.log(err);
                }) 
        },
        addCart(id){
            this.isLoading = true;
            axios.post(`${url}api/${path}/cart`,{
                data: { 
                    product_id: id,
                    qty: this.qty
                }})
                .then(res => {
                    this.isLoading = false;
                    if(res.data.success) {
                        this.getCart();
                    } else {
                        alert(res.data.message);
                    }
                })
                .catch(err => {
                    this.isLoading = false;
                    console.log(err);
                })
        },
        updateCartProduct(item){
            this.isLoading = true;
            axios.put(`${url}api/${path}/cart/${item.id}`,{
                    data: {
                        product_id: item.id,
                        qty: item.qty
                    }
                })
                .then(res => {
                    this.isLoading = false;
                    if(res.data.success){
                        console.log(res.data.message);
                        this.getCart();
                    } else {
                        alert(res.data.message);
                    }
                })
                .catch(err => {
                    this.isLoading = false;
                    console.log(err);
                })
        },
        delCartProduct(id){
            this.isLoading = true;
            axios.delete(`${url}api/${path}/cart/${id}`)
                .then(res => {
                    this.isLoading = false;
                    if(res.data.success) {
                        console.log(res.data.message);
                        this.getCart();
                    } else {
                        alert(res.data.message);
                    }
                })
                .catch(err => {
                    this.isLoading = false;
                    console.log(err);
                })
        },
        delAllCartProduct(){
            this.isLoading = true;
            axios.delete(`${url}api/${path}/carts`)
                .then(res => {
                    this.isLoading = false;
                    if(res.data.success) {
                        console.log(res.data.message);
                        this.getCart();
                    } else {
                        alert(res.data.message);
                    }
                })
                .catch(err => {
                    this.isLoading = false;
                    console.log(err);
                })
        },
        isPhone(value) {
            const phoneNumber = /^(09)[0-9]{8}$/
            return phoneNumber.test(value) ? true : '需要正確的電話號碼'
        },
        sendOrder(){
            axios.post(`${url}api/${path}/pay/:order_id`)
                .then(res => {
                    if(res.data.success) {
                        console.log(res.data.message);
                        this.delAllCartProduct();
                        this.getCart();
                    } else {
                        alert(res.data.message);
                    }
                })
                .catch(err => {
                    console.log(err);
                })
        }
    },
    created() {
        this.getProducts();
        this.getCart();
    },
})

app.component('loading', VueLoading);
app.component('VForm', VeeValidate.Form);
app.component('VField', VeeValidate.Field);
app.component('ErrorMessage', VeeValidate.ErrorMessage);

Object.keys(VeeValidateRules).forEach(rule => {
    if (rule !== 'default') {
      VeeValidate.defineRule(rule, VeeValidateRules[rule]);
    }
});

VeeValidateI18n.loadLocaleFromURL('./zh_TW.json');
// Activate the locale
VeeValidate.configure({
    generateMessage: VeeValidateI18n.localize('zh_TW'),
    validateOnInput: true, // 調整為輸入字元立即進行驗證
});

app.mount('#app');