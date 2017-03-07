module.exports = {
    model : false,
    create : function(mongoose){
        if(this.model){
            // fixed Cannot overwrite model once compiled Mongoose
            return this.model;
        }

        let model = mongoose.model('Cat', {
            name: String,
            friends: [String],
            age: Number,
            _enabled:Boolean
        });
        
        this.model = model;
        return this.model;
    }
}
