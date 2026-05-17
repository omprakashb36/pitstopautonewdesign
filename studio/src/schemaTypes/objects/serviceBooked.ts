import { defineField, defineType } from "sanity";

export default defineType({
    name: 'serviceBooked',
    title: 'Service Booked',
    type: 'object',
    fields: [
        defineField({
            name: 'titles',
            title: 'Titles',
            type: 'object',
            fields: [
                defineField({
                    name: 'title',
                    title: 'Title',
                    type: 'string',
                }),
                defineField({
                    name: 'subTitle',
                    title: 'Sub Title',
                    type: 'string',
                }),
            ],
        }),
        defineField({
            name: 'heading',
            title: 'Heading',
            type: 'blockContent',
        }),
        defineField({
            name: 'nextSteps',
            title: 'Next Steps',
            type: 'object',
            fields: [
                defineField({
                    name: 'steps',
                    title: 'steps',
                    type: 'blockContent',
                }),
                defineField({
                    name: 'stepsBackgroundImage',
                    title: 'Steps Background Image',
                    type: 'customImage',
                })
            ],
        }),
        defineField({
            name: 'BookingSummary',
            title: 'Booking Summary',
            type: 'object',
            fields: [
                defineField({
                    name: 'title',
                    title: 'Title',
                    type: 'string',
                }),
                defineField({
                    name: 'vehicleWorkshop',
                    title: 'Vehicle Workshop',
                    type: 'string',
                }),
                defineField({
                    name: 'custroInfo',
                    title: 'Customer Info',
                    type: 'string',
                }),
                defineField({
                    name: 'branchLabel',
                    title: 'Branch Label',
                    type: 'string',
                }),
                defineField({
                    name: 'nameLabel',
                    title: 'Name Label',
                    type: 'string',
                }),
                defineField({
                    name: 'emialLabel',
                    title: 'Email Label',
                    type: 'string',
                }),
                defineField({
                    name: 'contactLabel',
                    title: 'Contact No Label',
                    type: 'string',
                }),
                defineField({
                    name: 'brandLabel',
                    title: 'Brand Label',
                    type: 'string',
                }),
                defineField({
                    name: 'modelLabel',
                    title: 'Model Label',
                    type: 'string',
                }),
                defineField({
                    name: 'plateNoLabel',
                    title: 'Plate Number Label',
                    type: 'string',
                }),
                defineField({
                    name: 'vehicleDetails',
                    title: 'Vehicle Details',
                    type: 'string',
                }),
            ],
        }),
    ],
    preview: {
        select: {
            title: 'titles.title',
        },
        prepare(selection) {
            const { title } = selection;
            return {
                title: title || 'Service Booked',
                subtitle: 'Service Booked Section',
            };
        },
    },
});