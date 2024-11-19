const Banner = require("../models/bannerModel")

exports.getBanner = async (req,res) => {
    try {
        const banner = await Banner.find();
        if (banner) {
            return res.json({ message: "succesully fetched all banners", banner });
        }

    } catch (error) {
        console.log(err.message);
        return res.status(500).json({ message: "Failed to fetch banners" });
    }
}
exports.addBanner = async (req,res) => {
    console.log("hey");
    try {
        let { description } = req.body;
        console.log(req.file)
        const image = req.file?.path;
        console.log(description);
        if (!description) {
            description = undefined;
        }
        const existBanner = await Banner.findOne({
            name: {
                $regex: `^${description}$`,
                $options: ""
            }
        })
        if (existBanner)
            return res.status(400).json({ message: "Banner already exists" });
        else {
            const banner = await Banner.create({
                description, image
            })
            return res.status(200).json({
                message: "Banner added succesfully",
                banner
            })
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

exports.listBanner = async (req,res) => {
    try {
        const { id } = req.params;
        const banner = await Banner.findById(id);
        banner.isListed = !banner?.isListed
        banner.save();
        return res.status(200).json({ message: "success", banner })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: error.message || "Failed to list/unlist Category" })
    }
}
exports.deleteBanner = async (req,res) => {
    try {
        console.log(await Banner.find());
        let { id } = req.params;
        console.log("category id is:", id);
        if (!id) {
            return res.status(400).json({ message: "Banner ID is required" });
        }
        const deletedBanner = await Banner.
            findByIdAndDelete(id);
        console.log(deletedBanner)
        if (deletedBanner)
            return res.status(200).json({ message: "Banner successfully deleted" });
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ message: "failed to delete banner" });
    }
}