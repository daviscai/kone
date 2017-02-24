"use strict"

const send = require("./send");

module.exports = function serve(path, root) {
    // remove / begin
    path = path.indexOf('/') > -1 ? path.replace(/^\/+/, "") : path;

    return async function(ctx, next) {
        if(ctx.req.method == "HEAD" || ctx.req.method == "GET") {
            let req_path_array = ctx.path.slice(1).split("/");

            // match path
            if(path.length == 0 || path == req_path_array[0]) {
                // if not serve the root
                // then remove the filtered folder from path
                if(path.length != 0) {
                    req_path_array = req_path_array.slice(1);
                }
                //console.log(ctx.req.headers['accept-encoding']);
                await send(ctx, req_path_array.join("/") || "/", {root: root});
            }
        }

        return next();
    }

};
