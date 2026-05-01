import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import sidebarReducer from './sidebarSlice';
import categoryReducer from './categorySlice';
import subCategoryReducer from './subcategorySlice'
import dashboardReducer from './dashboardSlice';
import adminReducer from './adminUserSlice';
import colorReducer from './colorSlice';
import sizeReducer from './sizeSlice';
import sellerReducer from './sellerSlice';
import brandReducer from './brandSlice';
import viewOrderReducer from './orderSlice'
import productReducer from './productSlice';
import subCategoryTypeReducer from './subcategoryTypeSlice';
import paymentListReducer from './paymentListSlice'
import successOrderReducer from './successOrderSlice'
import shippedOrderReducer from './shippedOrderSlice'
import completedOrderReducer from './completedOrderSlice'
import viewAllCustomerReducer from './viewAllCustomerSlice';
import cancelledOrderReducer from './cancelledOrderSlice';
import customerOrderReducer from './customerOrderSlice';
import shippingMethodReducer from './shippingMethodSlice';
import regionReducer from "./regionSlice"
import bannerAdsReducer from './bannersAdsSlice'
import paymentMethodReducer from './paymentMethodSlice'
import ingredientReducer from './ingredientSlice'
import concernReducer from './concernSlice'
import orderDetailsReducer from './orderDetailsSlice'
import couponReducer from './discountCouponSlice'
import pushNotificationReducer from './pushNotificationSlice'
import shippingZoneReducer from './shippingPinCodeMethodSlice'
import faqReducer from './faqSlice'
import similarProductReducer from './similarProductSlice'
import typeofProductReducer from './typeofProductSlice'
import stepsReducer from './stepsSlice'
import menuReducer from './menuSlice';
import subMenuReducer from './submenuSlice'
import productSearchFilterReducer from './productSearchByFilterSlice'
import skinInsightProductReducer from './skinInsightSlice'
import returnOrderReducer from './returnListSlice'
import returnAcceptedReducer from './returnAcceptedSlice'
import returnClosedReducer from './orderClosedSlice'
import arrivalOrderReducer from './arrivalOrderSlice'

export const store = configureStore({
    reducer: {
        auth: authReducer,
        sidebar: sidebarReducer,
        dashboard: dashboardReducer,
        admin: adminReducer,
        category: categoryReducer,
        subCategory: subCategoryReducer,
        color: colorReducer,
        size: sizeReducer,
        brand: brandReducer,
        sellers: sellerReducer,
        allOrder: viewOrderReducer,
        successOrder: successOrderReducer,
        product: productReducer,
        subCategoryType: subCategoryTypeReducer,
        paymentList: paymentListReducer,
        shippedOrder: shippedOrderReducer,
        completedOrder: completedOrderReducer,
        viewAllCustomer: viewAllCustomerReducer,
        cancelledOrder: cancelledOrderReducer,
        customerOrder: customerOrderReducer,
        shippingMethod: shippingMethodReducer,
        region: regionReducer,
        bannerAds: bannerAdsReducer,
        paymentMethod: paymentMethodReducer,
        ingredient: ingredientReducer,
        concern: concernReducer,
        orderDetails: orderDetailsReducer,
        coupon: couponReducer,
        pushNotification: pushNotificationReducer,
        shippingZone: shippingZoneReducer,
        faq: faqReducer,
        similarProduct: similarProductReducer,
        menu: menuReducer,
        submenu: subMenuReducer,
        typeofProduct: typeofProductReducer,
        steps: stepsReducer,
        searchFilter: productSearchFilterReducer,
        skinInsight: skinInsightProductReducer,
        returnOrder: returnOrderReducer,
        returnAccepted:returnAcceptedReducer,
        returnClosed: returnClosedReducer,
        ArrivalOrder: arrivalOrderReducer
    },
});