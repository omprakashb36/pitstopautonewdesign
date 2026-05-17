import { defineField, defineType } from "sanity";

export default defineType({
    name: 'serviceListing',
    title : 'Service Listing',
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
                title: title || 'Service Listing Section',
                subtitle: 'Service Listing Section',
            };
        },
    },
});