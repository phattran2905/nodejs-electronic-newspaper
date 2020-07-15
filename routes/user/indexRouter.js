const authUtils = require('../../utils/authUtils');
const articleUtils = require('../../utils/articleUtils');
const categoryUtils = require('../../utils/categoryUtils');
const MenuModel = require('../../models/MenuModel');
const ArticleModel = require('../../models/ArticleModel');
const CategoryModel = require('../../models/CategoryModel');

module.exports = function(userRouter) {

    userRouter.get(
      ['/', '/home', '/index'],
      async (req,res) => { 
        try {
          const menu_list = await MenuModel.find({status: 'Activated'}).sort({display_order: 'asc'});
          const articleSelectedFields = '_id title summary interaction status categoryId authorId updated createdAt thumbnail_img';
          const latestArticles = await articleUtils.getLatestArticles(articleSelectedFields, 5);
          const hotArticles = await articleUtils.getLatestArticles(articleSelectedFields, 5); // Most likes
          const popularArticles = await articleUtils.getPopularArticles(articleSelectedFields, 5); // Most views
          const categoryWithPostCounted = await categoryUtils.getNumOfArticleByCategory();
          let articlesByHotCategory = Array();

          const hotCategories = await CategoryModel
            .find({status: 'Activated'}, '_id name')
            .sort({createdAt: 'asc'})
            .limit(4);

          for(let i =0; i < hotCategories.length; i++){
            articlesByHotCategory.push(
              {
                category: hotCategories[i],
                articles: await articleUtils.getArticleByCategory(hotCategories[i]._id, 5, articleSelectedFields)
              }
            )
          };
          
          return res.render('user/index', 
          {
            menu_list: menu_list,
            latestArticles: latestArticles,
            hotArticles: hotArticles,
            popularArticles: popularArticles,
            articlesByHotCategory: articlesByHotCategory,
            categoryWithPostCounted: categoryWithPostCounted,
            information: authUtils.getAuthorProfile(req)
          });
        } catch (error) {
          return res.render(
            "error/user-404", 
            {redirectLink: '/'}
          );
        }
        
      }
    );

    userRouter.get(
      '/article',
      async (req, res) => {
        try {
          const menu_list = await MenuModel.find({status: 'Activated'}).sort({display_order: 'asc'});
          const latestArticles = await articleUtils.getLatestArticles(articleSelectedFields, 5);
          const popularArticles = await articleUtils.getPopularArticles(articleSelectedFields, 5);

          if (req.query.id) {
              const article = await ArticleModel
              .findOne({$and: [{status: 'Published'},{_id: req.query.id}]})
              .populate({
                path: 'categoryId',
                select: '_id name'
              })
              .populate({
                path: 'authorId',
                select: '_id profile'
              });
              
            if (article) {
              return res.render('user/article',
              {
                latestArticles: latestArticles,
                popularArticles: popularArticles,
                article: article,
                menu_list: menu_list,
              });
            }
          }

          return res.render("error/user-404", 
            {
              redirectLink: '/'
            }
          );
        } catch (error) {
          return res.render("error/user-404", 
            {
              redirectLink: '/'
            }
          );
        }
      }
    );

    userRouter.get(
      '/about',
      async (req, res) => {

        try {
          const menu_list = await MenuModel.find({status: 'Activated'}).sort({display_order: 'asc'});
          const articleSelectedFields = '_id title summary interaction status categoryId authorId updated createdAt thumbnail_img';
          const latestArticles = await articleUtils.getLatestArticles(articleSelectedFields, 5);
          const popularArticles = await articleUtils.getPopularArticles(articleSelectedFields, 5);

          return res.render('user/about', 
            {
              menu_list: menu_list,
              latestArticles: latestArticles,
              popularArticles: popularArticles,
              information: authUtils.getAuthorProfile(req)
            });
        } catch (error) {
          return res.render(
            "error/user-404", 
            {redirectLink: '/'}
          );
        }
      }
    );

    userRouter.get(
      '/contact',
      async (req, res) => {

        try {
          const menu_list = await MenuModel.find({status: 'Activated'}).sort({display_order: 'asc'});
          const articleSelectedFields = '_id title summary interaction status categoryId authorId updated createdAt thumbnail_img';
          const latestArticles = await articleUtils.getLatestArticles(articleSelectedFields, 5);
          const popularArticles = await articleUtils.getPopularArticles(articleSelectedFields, 5);

          return res.render('user/contact', 
            {
              menu_list: menu_list,
              latestArticles: latestArticles,
              popularArticles: popularArticles,
              information: authUtils.getAuthorProfile(req)
            });
        } catch (error) {
          return res.render(
            "error/user-404", 
            {redirectLink: '/'}
          );
        }
      }
    );

    userRouter.get(
      ['/terms_of_services', '/privacy_policy'],
      async (req, res) => {

        try {
          const menu_list = await MenuModel.find({status: 'Activated'}).sort({display_order: 'asc'});
          const articleSelectedFields = '_id title summary interaction status categoryId authorId updated createdAt thumbnail_img';
          const latestArticles = await articleUtils.getLatestArticles(articleSelectedFields, 5);
          const popularArticles = await articleUtils.getPopularArticles(articleSelectedFields, 5);

          return res.render('user/terms_of_services', 
            {
              menu_list: menu_list,
              latestArticles: latestArticles,
              popularArticles: popularArticles,
              information: authUtils.getAuthorProfile(req)
            });
        } catch (error) {
          return res.render(
            "error/user-404", 
            {redirectLink: '/'}
          );
        }
      }
    );

};