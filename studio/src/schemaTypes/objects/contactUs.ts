import { defineField, defineType, Preview } from "sanity";

export const contactUsForm = defineType({
    name: "contactUsForm",
    title: "Contact Us Form",
    type: "object",
    fields: [
        defineField({
            name: "title",
            title: "Form Name",
            type: "string",
        }),
        defineField({
            name: "heading",
            title: "Heading",
            type: "string",
        }),
        defineField({
            name: 'firstNameLabel',
            title: 'First Name Label',
            type: 'string'
        }),
        defineField({
            name: 'firstNamePlaceholder',
            title: 'First Name Placeholder',
            type: 'string'
        }),
        defineField({
            name: 'lastNameLabel',
            title: 'Last Name Label',
            type: 'string'
        }),
        defineField({
            name: 'lastNamePlaceholder',
            title: 'Last Name Placeholder',
            type: 'string'
        }),
        defineField({
            name: 'emailLabel',
            title: 'Email Label',
            type: 'string'
        }),
        defineField({
            name: 'emailPlaceholder',
            title: 'Email Placeholder',
            type: 'string'
        }),
        defineField({
            name: 'countryLabel',
            title: 'Country Label',
            type: 'string'
        }),
         defineField({
            name: 'contactNumberLabel',
            title: 'Contact Number Label',
            type: 'string'
        }),
        defineField({
            name: 'contactNumberPlaceholder',
            title: 'Contact Number Placeholder',
            type: 'string'
        }),
        defineField({
            name: 'subjectLabel',
            title: 'Subject Label',
            type: 'string'
        }),
        defineField({
            name: 'subjectPlaceholder',
            title: 'Subject Placeholder',
            type: 'string'
        }),
        defineField({
            name: 'queryBoxLabel',
            title: 'Query Box Label',
            type: 'string'
        }),
        defineField({
            name: 'queryBoxPlaceholder',
            title: 'query Box Placeholder',
            type: 'string'
        }),
        defineField({
            name: 'submitBtnText',
            title: 'Submit Button Text',
            type: 'string'
        })      
    ],
    preview: {
        select: {
            title: 'title',

        },
        prepare(selection) {
            const { title } = selection ;
            return {
                title: title || "Contact Us Form",
                subtitle:  "Contact Us Form",
            } 
        },
    },
});
