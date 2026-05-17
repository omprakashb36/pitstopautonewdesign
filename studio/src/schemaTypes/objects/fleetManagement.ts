import { defineField, defineType } from "sanity";
import { title } from "../../lib/initialValues";

export const fleetManagementForm = defineType({
    name: "fleetManagement",
    title: "Fleet Management Form",
    type: "object",
    fields: [
        defineField({
            name: "title",
            title: "Form Name",
            type: "string",
        }),
        defineField({
            name: 'companyAndFleetDetails',
            title: 'Company And Fleet Details',
            type: 'object',
            fields:[
                defineField({
                    name: "heading",
                    title: "Heading",
                    type: "string",
                }),
                defineField({
                    name: 'companyNameLabel',
                    title: 'Comapny Name Label',
                    type: 'string'
                }),
                defineField({
                    name: 'companyNamePlaceholder',
                    title: 'Company Name Placeholder',
                    type: 'string'
                }),
                defineField({
                    name: 'managerFirstNameLabel',
                    title: "Manger's Name Label",
                    type: 'string'
                }),
                defineField({
                    name: 'managerFirstNamePlaceholder',
                    title: "Manger's Name Placeholder",
                    type: 'string'
                }),
                 defineField({
                    name: 'managerLastNameLabel',
                    title: 'Manager Last Name Label',
                    type: 'string',
                    readOnly : true,
                }),
                defineField({
                    name: 'managerLastNamePlaceholder',
                    title: 'Manager Last Name Placeholder',
                    type: 'string',
                     readOnly : true,
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
            ],
        }),
        defineField({
            name: 'fleetDetails',
            title: 'Fleet Details',
            type: 'object',
            fields:[
                defineField({
                    name: 'heading',
                    title: 'Heading',
                    type: 'string'
                }),
                defineField({
                    name: 'numberOfVehicleLabel',
                    title: 'Number Of Vehicle Label',
                    type: 'string'
                }),
                defineField({
                    name: 'numberOfVehiclePlaceholder',
                    title: 'Number Of Vehicle Placeholder',
                    type: 'string'
                }),
                defineField({
                    name: 'prferedGarageLabel',
                    title: 'Prefered Garage Label',
                    type: 'string'
                }),
                defineField({
                    name: 'prferedGaragePlaceholder',
                    title: 'Prefered Garage Placeholder',
                    type: 'string'
                })
            ]
        }),
        defineField({
            name: 'submitText',
            title: 'Submit Text',
            type: 'string'
        })
    ],
    preview:{
        select: {
            title: 'title'
        },
        prepare({ title }) {
            return {
                title: title || 'Fleet Management Form',
                subtitle: 'Fleet Management Form',
            };
        },
   }
});
