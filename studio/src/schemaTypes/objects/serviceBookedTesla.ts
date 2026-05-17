import { defineField, defineType } from "sanity";

export default defineType({
    name: 'serviceBookedTesla',
    title : 'Service Booked Tesla',
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
                title: title || 'Service Booked Tesla Section',
                subtitle: 'Service Booked Tesla Section',
            };
        },
    },
});