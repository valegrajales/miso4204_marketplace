define(['component/shoppingCartMasterComponent', 'component/productComponent'], function (ShoppingCartMasterComponent, cartCp) {
    App.Component.CompositeComponentShopping = App.Component.BasicComponent.extend({
        initialize: function () {
            this.componentId = App.Utils.randomInteger();
            this.name = "MarketPlace";
            this.setupProductComponent();
            this.setupCartMasterComponent();
        }, render: function (domElementId) {
            if (domElementId) {
                var rootElement
                        = $("#" + domElementId)
                rootElement.append("<div id='main' class='col-md-8'></div>");
                rootElement.append("<div id='cart' class='col-md-4'></div>");
                $("#cart").append("<div id='master'></div>");
                $("#cart").append("<div id='items'></div>");
                this.productComponent.render("main");
                this.cartMasterComponent.renderMaster('master');
                this.cartMasterComponent.masterComponent.create();
                this.cartMasterComponent.masterComponent.listComponent.display(false);
                this.cartMasterComponent.renderChild('item', 'items');
                this.cartMasterComponent.shoppingCartItemComponent.render('cart');
                console.log(Object.getOwnPropertyNames(this.cartMasterComponent.shoppingCartItemComponent));
                this.cartMasterComponent.shoppingCartItemComponent.toolbarComponent.display(false);
                this.cartMasterComponent.shoppingCartItemComponent.listComponent.render();
                //Backbone.trigger(this.cartMasterComponent.shoppingCartItemComponent.componentId + '-' + 'post-shoppingCartItem-save', {model: this.cartMasterComponent.shoppingCartItemComponent.currentModel});
                //renderChild('item', 'items');


            }

            this.productComponent.renderRecords();
            this.cartMasterComponent.renderChild('item');
        }, setupProductComponent: function () {
            this.productComponent = new cartCp();
            this.productComponent.initialize();
            this.productComponent.enableMultipleSelection(true);
            this.productComponent.setReadOnly(true);
            this.productComponent.addRecordAction({
                name: 'addToCart',
                icon: '',
                displayName: 'Add to cart',
                show: true
            },
            this.addItem,
                    this);
            this.productComponent.addGlobalAction({
                name: 'buy',
                icon: 'glyphicon-shopping-cart',
                displayName: 'Add to cart',
                show: true,
                menu: 'utils'
            },
            this.addToCart,
                    this);
        }, setupCartMasterComponent: function () {
            this.cartMasterComponent = new ShoppingCartMasterComponent();
            this.cartMasterComponent.initialize();
            this.cartMasterComponent.masterComponent.clearGlobalActions();
            this.cartMasterComponent.masterComponent.addGlobalAction({
                name: 'checkout',
                icon: 'glyphicon-shopping-cart',
                displayName: 'Checkout',
                show: true
            },
            this.buy,
                    this);
            this.cartMasterComponent.shoppingCartItemComponent.setGlobalActionsVisible(false);
            this.cartMasterComponent.shoppingCartItemComponent.disableEdit();
            this.cartMasterComponent.hideChilds();
        }, addToCart: function () {
            var items = this.productComponent.getSelectedRecords();
            var idList = [];
            for (var property in items) {
                if (items.hasOwnProperty(property)) {
                    idList.push({productId: items[property].id});
                }
            }
            this.cartMasterComponent.addItems(idList);
            this.productComponent.clearSelectedRecords();
            this.render();
            this.cartMasterComponent.shoppingCartItemComponent.listComponent.render();
        }, addItem: function (params) {
            this.cartMasterComponent.addItems([{productId: params.id}]);
            this.productComponent.clearSelectedRecords();
            this.render();
            this.cartMasterComponent.shoppingCartItemComponent.listComponent.render();
        }, buy: function () {
           document.location.href="http://localhost:8084/purchase.web";
        }
    });
    return App.Component.CompositeComponentShopping;
});