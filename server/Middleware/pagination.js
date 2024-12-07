exports.pagination = (model) => {

    return async (req, res, next) => {
        try {
            const data = await model.find().populate([
                { path: "category" },
                { path: "brand" }
            ]);
            let { page, limit } = req.query;
            page = parseInt(page);
            limit = parseInt(limit);
            const startIndex = (page - 1) * limit;
            const lastIndex = page * limit;

            const results = {};

            if (lastIndex < data.length) {
                results.next = {
                    page: page + 1,
                    limit: limit
                }
            }
            if (startIndex > 0) {
                results.prev = {
                    page: page - 1
                }
            }
            results.totaldata = data.length;
            results.pageCount = Math.ceil(data.length / limit);
            results.data = data.slice(startIndex, lastIndex);
            res.locals.results = results;
            next()
        } catch (error) {
            console.log(error);
            return res.status(400).json({ message: "Error occured while paginating" })
        }
    }

}