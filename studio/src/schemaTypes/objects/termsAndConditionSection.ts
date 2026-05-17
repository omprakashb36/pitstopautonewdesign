
import { defineField, defineType } from "sanity";

export const termsAndConditionSection = defineType({
    name : 'termsAndConditionSection',
    type : 'object',
    title : 'Center Align Rich Text Component',
    fields : [
        defineField({
            name: "title",
            type: "string",
        }),
        defineField({
            name : 'richText',
            type : 'blockContent',
            title : 'Rich Text Column',
            validation:rule=> rule.required().error('This field is required')
        }),
    ],
    preview:{
        select:{
            title: "title",
        },
        prepare({ title }) {
            return {
                title: title ? title : 'Section: Untitled',
                subtitle: 'Terms & Conditions Content',
            };
        },
    }
})
