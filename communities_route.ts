const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.resolve("./uploads"));
    },
    filename: function (req, file, cb) {
        cb(null, `${file.originalname.split(".")[0]}-${Date.now()}.${file.originalname.split(".")[1]
            }`
        );
    },
});
const upload = multer({ storage });

// routes//

app.post("/application", async (req, res, next) => {
    try {
        const { title, created_at, updated_at } = req.body;
        const users: Application[] = await jsonfile.readFile(
            Files.APPLICATIONS
        );
        if (!title) {
            res.redirect("Must write the title");
            return;
        }
        users.push({
            title,
            createdDate: format(new Date(), "YYYY-MM-DD HH:mm:ss"),
            updatedDate: format(new Date(), "YYYY-MM-DD HH:mm:ss")
        });

    } catch (error) {
        console.log(error);
    }
})