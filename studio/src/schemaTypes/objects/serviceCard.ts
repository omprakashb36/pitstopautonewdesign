import { defineType, defineField } from 'sanity';

export default defineType({
    name: 'serviceCard',
    title: 'Service Card',
    type: 'object',
    fields: [
        defineField({
            name: 'serviceCode',
            title: 'Service Code',
            type: 'string',
        }),
        defineField({
            name: 'title',
            title: 'Title',
            type: 'string',
            description: 'The title of the service, e.g., "Basic Service".',
        }),
        defineField({
            name: 'warranty',
            title: 'Warranty',
            type: 'string',
            description: 'Warranty details, e.g., "1000 km or 1 Month Warranty".',
        }),
        defineField({
            name: 'recommendation',
            title: 'Recommendation',
            type: 'boolean',
            description: 'Whether the service is recommended.',
        }),
        defineField({
            name: 'interval',
            title: 'Service Interval',
            type: 'string',
            description: 'Service interval details, e.g., "INDICATED EVERY 10,000 KM / 6 MONTHS".',
        }),
        defineField({
            name: 'duration',
            title: 'Duration',
            type: 'string',
            description: 'Duration of the service, e.g., "1 Hour".',
        }),
        defineField({
            name: 'features',
            title: 'Features',
            type: 'array',
            of: [{ type: 'string' }],
            description: 'List of features included in the service, e.g., "Vehicle Health Check".',
        }),
        defineField({
            name: 'price',
            title: 'Price',
            type: 'object',
            fields: [
                defineField({
                    name: 'original',
                    title: 'Original Price',
                    type: 'number',
                    description: 'The original price of the service.',
                }),
                defineField({
                    name: 'discounted',
                    title: 'Discounted Price',
                    type: 'number',
                    description: 'The discounted price of the service.',
                }),
                defineField({
                    name: 'discountPercentage',
                    title: 'Discount Percentage',
                    type: 'number',
                    description: 'The discount percentage, e.g., "30%".',
                }),
            ],
        }),
        defineField({
            name: 'image',
            title: 'Service Image',
            type: 'image',
            description: 'Image size should be 240x246 pixels',
        }),
        defineField({
            name: 'ctaLabel',
            title: 'CTA Label',
            type: 'string',
            readOnly : true,
            description: 'Label for the call-to-action button, e.g., "Add This Service".',
            deprecated: { reason: 'This field is deprecated and will be removed in future versions.' },
        }),
    ],
    preview: {
        select: {
            title: 'title',
            serviceCode: 'serviceCode',
            image: 'image',
        },
        prepare(selection) {
            const { title, image } = selection;
            return {
                title: title || 'Service Card',
                subtitle: "Service Card Section ",
                media: image,
            };
        },
    },
});