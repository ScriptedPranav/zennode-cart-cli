// Description: This file contains all the constants used in the application.
const GIFT_FEE = 1
const SHIPPING_FEE = 5

const entries = [
    ['a',20],
    ['b',40],
    ['c',50]
]

const list = new Map(entries)

const products = new Map(list)

exports.GIFT_FEE = GIFT_FEE
exports.SHIPPING_FEE = SHIPPING_FEE
exports.products = products
