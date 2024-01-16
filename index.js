const readline = require('readline/promises')
const constants = require('./constants')
const {GIFT_FEE, SHIPPING_FEE, products} = constants


//readline interface to get user input
const rl = readline.createInterface({
    input : process.stdin,
    output: process.stdout
})

//Cart class to store the items and calculate the total
class Cart {
    constructor() {
        this.items = []
        this.total = 0
        this.totalQuantity = 0
    }

    //add item to the cart
    add_item(item) {
        this.items.push(item)
        this.total += item.price
        if(item.gift) {
            this.total += this.gift_fee(item.quantity)
        }
        this.totalQuantity += item.quantity
    }

    //calculate flat_10 discount
    flat_10() {
        const totalAmount = this.total
        let discount = 0
        if(totalAmount > 200) {
            discount = 10
            return discount
        }
        return discount
    }

    //calculate bulk_5 discount
    bulk_5() {
        let discount = 0
        this.items.forEach(item => {
            const {quantity, price} = item
            if (quantity > 10) {
                discount += 0.05 * price
            }
        })
    }

    //calculate bulk_10 discount
    bulk_10() {
        let discount = 0
        const totalQuantity = this.totalQuantity
        const totalAmount = this.total
        if (totalQuantity > 20) {
            discount = 0.1 * totalAmount
        }
        return discount
    }

    //calculate tiered_50 discount
    tiered_50() {
        const totalQuantity = this.totalQuantity
        let discount = 0
        this.items.forEach(item => {
            const {quantity,price} = item
            if(quantity > 15 && totalQuantity > 30) {
                discount += 0.5 * price
            } 
        })
        return discount
    }

    //get the best discount with name and amount
    get_best_discount() {
        const discounts = [
            { name: 'flat_10', amount: this.flat_10() },
            { name: 'bulk_5', amount: this.bulk_5() },
            { name: 'bulk_10', amount: this.bulk_10() },
            { name: 'tiered_50', amount: this.tiered_50() }
        ];
    
        const maxDiscount = discounts.reduce((max, discount) => {
            return discount.amount > max.amount ? discount : max;
        }, { name: 'no_discount', amount: 0 });
    
        return maxDiscount;
    }
    
    //calculate gift fee
    gift_fee(qty) {
        return GIFT_FEE * qty
    }

    //calculate shipping fee
    shipping_fee() {
        return Math.ceil(this.totalQuantity/10) * SHIPPING_FEE
    }

    //clear the cart
    clear_items() {
        this.items = []
    }
}




async function shop() {
    try {
        //create a new cart
        const shoppingCart = new Cart()

        //get the user input
        for (const [key, value] of products) {
            
            let quantity = await rl.question(`How many Product_${key.toUpperCase()} do you want? `)
            quantity = parseInt(quantity)
            let response = await rl.question("Do you want gift wrap? (y/n) ")
            let gift = false
            if(response === 'y') {
                gift = true
            }
            shoppingCart.add_item({name: key, quantity: quantity, price: quantity * value, gift: gift})
        }

        //close the readline interface
        rl.close()

        //print the details
        const details = {
            products : shoppingCart.items,
            subTotal : shoppingCart.total,
            discount : shoppingCart.get_best_discount(),
            shippingFee : shoppingCart.shipping_fee(),
            total : shoppingCart.total - shoppingCart.get_best_discount().amount + shoppingCart.shipping_fee(),
        }
        console.log(details)
    }catch(err) {
        console.error(err)
    }
}

//start the shopping
shop()

