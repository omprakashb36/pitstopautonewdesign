import { defineField, defineType } from "sanity";

export default defineType({
    name: 'testimonial',
    title: 'Testimonial Carousel',
    type: 'object',
    fields: [
        defineField({
            name: 'heading',
            title: 'Heading',
            type: 'string',
        }), 
        defineField({
            name: 'subHeading',
            title: 'Sub Heading',
            type: 'string',
        }),       
    ],
    preview: {
        select: {
            title: 'heading',
        },
        prepare({ title }) {
            return {
                title: title || 'Testimonial Section',
                subtitle: 'Testimonial Section',
            };
        },
    },
});