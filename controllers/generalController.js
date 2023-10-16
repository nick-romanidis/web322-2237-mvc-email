const express = require("express");
const router = express.Router();

// Setup a home page
router.get("/", (req, res) => {
    res.render("general/home", {
        title: "Home Page"
    });
});

router.get("/contact-us", (req, res) => {
    res.render("general/contact-us", {
        title: "Contact Us",
        values: {
            firstName: "",
            lastName: "",
            email: "",
            message: ""
        },
        validationMessages: {}
    });
});

router.post("/contact-us", (req, res) => {
    console.log(req.body);

    const { firstName, lastName, email, message } = req.body;

    let passedValidation = true;
    let validationMessages = {};

    if (typeof firstName !== "string" || firstName.trim().length === 0) {
        passedValidation = false;
        validationMessages.firstName = "You must specify a first name.";
    }
    else if (typeof firstName !== "string" || firstName.trim().length <= 2) {
        passedValidation = false;
        validationMessages.firstName = "The first name should be at least 2 characters.";
    }

    if (passedValidation) {
        // Send the contact us email
        const sgMail = require("@sendgrid/mail");
        sgMail.setApiKey(process.env.SEND_GRID_API_KEY);

        const msg = {
            to: "nick.romanidis@gmail.com",
            from: "nick.romanidis@senecacollege.ca",
            subject: "Contact Us Form Submission",
            html:
                `Visitor's Full Name: ${firstName} ${lastName}<br>
                Visitor's Email Address: ${email}<br>
                Visitor's message: ${message}<br>
                `
        };

        sgMail.send(msg)
            .then(() => {
                res.send("Success, validation passed, email sent!");
                //res.redirect("/welcome");
            })
            .catch(err => {
                console.log(err);

                res.render("general/contact-us", {
                    title: "Contact Us",
                    values: req.body,
                    validationMessages
                });
            });
    }
    else {
        res.render("general/contact-us", {
            title: "Contact Us",
            values: req.body,
            validationMessages
        });
    }
});

module.exports = router;