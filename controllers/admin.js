const Product = require('../models/product');


exports.postAddProducts = (req,res,next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  const product = new Product({
    title: title, 
    imageUrl: imageUrl, 
    price: price, 
    description: description,
    userId: req.user
  });

  product.save()
  .then(() => {
    res.redirect('/admin/products');
  })
  .catch(err => {
    console.log(err);
    res.status(502).redirect('/');
  });
};

exports.getAddProducts = (req,res,next) => {
  res.render('admin/edit-product',{
    pageTitle: 'Add Product', 
    editing: false,
    path: '/admin/add-product',
    isAuthenticated: req.session.isLogged
  });
};

exports.getProducts = (req,res,next) => {
  Product.find({userId: req.user._id})
  .then(products => {
    res.render('admin/products',{
      prods: products, 
      pageTitle: 'Admin Product', 
      path: '/admin/products',
      isAuthenticated: req.session.isLogged
    });
  })
  .catch(err => {
    console.log(err);
    res.redirect('/');
  });
};

exports.getEditProducts = (req,res,next) => {
  const id = req.params.productId;
  Product.findById(id)
  .then(product => {
    res.render('admin/edit-product',{
      pageTitle: 'Edit Product', 
      product: product, 
      editing: true,
      path: '/admin/edit-product',
      isAuthenticated: req.session.isLogged
    });
  })
  .catch(err =>{
    console.log(err);
    res.status(502).redirect('/');
  });
  
};

exports.postEditProducts = (req,res,next) => {
  const id = req.body.productId;
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  
  Product.findById(id)
  .then(product => {
    if(product.userId.toString() !== req.user._id.toString()){
      return res.redirect('/');
    }
    product.title = title;
    product.imageUrl = imageUrl;
    product.price = price;
    product.description = description;

    return product.save()  
    .then(result => res.redirect('/admin/products'))
    .catch(err =>{
      next(new Error(err));
    });
  })
  .catch(err =>{
    next(new Error(err));
  });
};

 exports.getDeleteProducts = (req,res,next) => {
  const id = req.params.productId;

  Product.deleteOne({_id: id, userId: req.user._id})
  .then(result => res.redirect("/admin/products"))
  .catch(err => {
    next(new Error(err));
  })
 };