exports.admin = async ctx => {
    const res = await ctx.render('admin', {
        msg: 'World'
    });
    return res;
};