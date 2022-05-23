const mongoose = require('mongoose');
const validator = require('validator');
const bcryptjs = require('bcryptjs');

const LoginSchema = new mongoose.Schema({
    email: {type: String, required: true},
    password: {type: String, required: true},
   
})

const LoginMode1 = mongoose.model('Login', LoginSchema);

class Login{
    constructor(body){
        this.body = body;
        this.errors = [];
        this.user = null;
    }

    async login(){
        this.valida();
        if(this.errors.length > 0) return;
        this.user = await LoginMode1.findOne({email: this.body.email});

        if(!this.user){
            this.errors.push('Usuário não existe.');
            return;
        } 
        
        if(!bcryptjs.compareSync(this.body.password, this.user.password)){
            this.errors.push('Senha Inválida');
            this.user = null;
            return;
        }
    }


    //validacao de registro
     async register(){
        this.valida();
        if(this.errors.length > 0) return;

        await this.userExists(); 

        if(this.errors.length > 0) return;


        //criptografando a senha 
        const salt = bcryptjs.genSaltSync();
        this.body.password = bcryptjs.hashSync(this.body.password, salt);
        this.user = await LoginMode1.create(this.body);
       
        
    }

    //validar se o usuário já existe
    async userExists(){
        this.user = await LoginMode1.findOne({email: this.body.email});

        if(this.user) this.errors.push('Usuário já existe.');
    }

    valida(){
        this.cleanUp();

        //validando o email
        if(!validator.isEmail(this.body.email)) this.errors.push('Email inválido');

        //validando a senha 
        if(this.body.password.length < 3 || this.body.password.length > 50 ){
            this.errors.push('A senha precisa ter entre 3 e 50 caracteres.');
        }
    }

    cleanUp(){
            for(const key in this.body){
             if(typeof this.body[key] !== 'string'){
                this.body[key] = '';
            }   
        }

        this.body = {
            email: this.body.email,
            password: this.body.password
        };
    }
}

module.exports = Login;