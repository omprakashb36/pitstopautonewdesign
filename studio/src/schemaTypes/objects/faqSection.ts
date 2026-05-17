import { defineField, defineType } from "sanity";

export default defineType({
    name: 'faqSection',
    title: 'FAQ Section',
    type: 'object',
    fields: [
        defineField({
            name: 'heading',
            title: 'Title',
            type: 'string',
        }),        
    ],
    preview: {
        select: {
            title: 'heading',
        },
        prepare({ title }) {
            return {
                title: title || 'FAQ Section',
                subtitle: 'FAQ Section',
            };
        },
    },
});