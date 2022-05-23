const Login = require('../models/loginModel')


exports.index = (req, res) => {
    if(req.session.user) return res.render('login-logado');
    return res.render('login');
}

exports.register = async (req, res) => {
    try{
        const login = new Login(req.body);
        await login.register();
     
        //exibir mensagem de erro se o email ou senha forem inválidos
        if(login.errors.length > 0 ){
            req.flash('errors', login.errors);
            req.session.save(function(){
             return res.redirect('back');
            });
            return;
        }

        req.flash('sucess','Usuário criado com sucesso!!' );
        req.session.save(function(){
         return res.redirect('back');
        });
    }catch(e){
        console.log(e);
         return res.render('404');

    }
  
}


exports.login = async (req, res) => {
    try{
        const login = new Login(req.body);
        await login.login();
     
        //exibir mensagem de erro se o email ou senha forem inválidos
        if(login.errors.length > 0 ){
            req.flash('errors', login.errors);
            req.session.save(function(){
             return res.redirect('back');
            });
            return;
        }

        req.flash('sucess','Bem vindo!!');
        req.session.user = login.user;
        req.session.save(function(){
         return res.redirect('back');
        });
    }catch(e){
        console.log(e);
         return res.render('404');

    }
  
}

exports.logout = function(req, res){
    req.session.destroy();
    res.redirect('/');
}