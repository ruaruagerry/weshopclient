const ApiRootUrl = 'http://127.0.0.1:3001/';

module.exports = {
    CatalogList: ApiRootUrl + 'catalog/index',  //分类目录全部分类数据接口
    CatalogCurrent: ApiRootUrl + 'catalog/current',  //分类目录当前分类数据接口

    AuthLogin: ApiRootUrl + 'auth/login', //微信登录

    GoodsCount: ApiRootUrl + 'goods/count',  //统计商品总数
    GoodsList: ApiRootUrl + 'goods/list',  //获得商品列表
    GoodsDetail: ApiRootUrl + 'goods/detail',  //获得商品的详情
    GoodsNew: ApiRootUrl + 'goods/new',  //新品
    GoodsHot: ApiRootUrl + 'goods/hot',  //热门
    GoodsRelated: ApiRootUrl + 'goods/related',  //商品详情页的关联商品（大家都在看）

    BrandList: ApiRootUrl + 'brand/list',  //品牌列表
    BrandDetail: ApiRootUrl + 'brand/detail',  //品牌详情

    CartList: ApiRootUrl + 'cart/index', //获取购物车的数据
    CartAdd: ApiRootUrl + 'cart/add', // 添加商品到购物车
    CartUpdate: ApiRootUrl + 'cart/update', // 更新购物车的商品
    CartDelete: ApiRootUrl + 'cart/delete', // 删除购物车的商品
    CartChecked: ApiRootUrl + 'cart/checked', // 选择或取消选择商品
    CartCheckedAll: ApiRootUrl + 'cart/checkedall', //全选
    CartCount: ApiRootUrl + 'cart/count', // 获取购物车商品件数

    ShopCheckout: ApiRootUrl + 'shop/checkout', // 下单前信息确认
    ShopAddressList: ApiRootUrl + 'shop/address/list',  //收货地址列表
    ShopAddressDetail: ApiRootUrl + 'shop/address/detail',  //收货地址详情
    ShopAddressSave: ApiRootUrl + 'shop/address/save',  //保存收货地址
    ShopAddressDelete: ApiRootUrl + 'shop/address/delete',  //保存收货地址
    ShopOrderSubmit: ApiRootUrl + 'shop/order/create', // 提交订单
    ShopOrderList: ApiRootUrl + 'shop/order/list',  //订单列表
    ShopOrderDetail: ApiRootUrl + 'shop/order/detail',  //订单详情
    ShopOrderCancel: ApiRootUrl + 'shop/order/cancel',  //取消订单
    ShopCollectAdd: ApiRootUrl + 'shop/collect/add',  //添加收藏
    ShopCollectDelete: ApiRootUrl + 'shop/collect/delete',  //添加收藏
    ShopCollectList: ApiRootUrl + 'shop/collect/list',  //收藏列表

    PayPrepayId: ApiRootUrl + 'pay/prepay', //获取微信统一下单prepay_id

    CommentList: ApiRootUrl + 'comment/list',  //评论列表
    CommentCount: ApiRootUrl + 'comment/count',  //评论总数
    CommentPost: ApiRootUrl + 'comment/post',   //发表评论

    TopicList: ApiRootUrl + 'topic/list',  //专题列表
    TopicDetail: ApiRootUrl + 'topic/detail',  //专题详情
    TopicRelated: ApiRootUrl + 'topic/related',  //相关专题

    SearchIndex: ApiRootUrl + 'search/index',  //搜索页面数据
    SearchResult: ApiRootUrl + 'search/result',  //搜索数据
    SearchHelper: ApiRootUrl + 'search/helper',  //搜索帮助
    SearchClearHistory: ApiRootUrl + 'search/clearhistory',  //搜索帮助

    RegionList: ApiRootUrl + 'region/list',  //获取区域列表


    OrderExpress: ApiRootUrl + 'order/express', //物流详情

    FootprintList: ApiRootUrl + 'footprint/list',  //足迹列表
    FootprintDelete: ApiRootUrl + 'footprint/delete',  //删除足迹
};