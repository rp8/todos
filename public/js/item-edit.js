(function(){dust.register("item-edit.dust",body_0);function body_0(chk,ctx){return chk.write("<input type=\"text\" value=\"").reference(ctx.get("title"),ctx,"h").write("\" /><a clsss=\"save\">Save</a>");}return body_0;})();