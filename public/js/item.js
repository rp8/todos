(function(){dust.register("item.dust",body_0);function body_0(chk,ctx){return chk.write("<div class=\"view\"><input class=\"toggle\" type=\"checkbox\" ").section(ctx.get("done"),ctx,{"else":body_1,"block":body_2},null).write(" /><label>").reference(ctx.get("title"),ctx,"h").write("</label><a class=\"destroy\"></a></div><input class=\"edit\" type=\"text\" value=\"").reference(ctx.get("title"),ctx,"h").write("\" />");}function body_1(chk,ctx){return chk.write(" \"\" ");}function body_2(chk,ctx){return chk.write(" checked=\"checked\" ");}return body_0;})();